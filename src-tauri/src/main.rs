#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod ffmpeg;

use anyhow::Result;
use indicatif::{ProgressBar, ProgressStyle};
use std::{
    fs,
    io::{self, copy, Read},
    path::{Path, PathBuf},
};

use url::Url;
struct DownloadProgress<'a, R> {
    inner: R,
    progress_bar: &'a ProgressBar,
}

impl<R: Read> Read for DownloadProgress<'_, R> {
    fn read(&mut self, buf: &mut [u8]) -> io::Result<usize> {
        self.inner.read(buf).map(|n| {
            self.progress_bar.inc(n as u64);
            unsafe { PROGRESS_SIZE_NOW += n };
            n
        })
    }
}

static mut PROGRESS_SIZE_NOW: usize = 0;
static mut TOTAL_PROGRESS_SIZE: u64 = 0;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            download_youtube,
            merge,
            get_bar_total_size,
            get_bar_size_now
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn download_youtube(url: &str, filename: &str, onlyaudio: bool) -> Result<(), ()> {
    let url = Url::parse(url).unwrap();
    
    let resp = ureq::get(url.as_str()).call().unwrap();
    // Find the video size:
    let total_size = resp
        .header("Content-Length")
        .unwrap_or("0")
        .parse::<u64>()
        .unwrap();
    unsafe { TOTAL_PROGRESS_SIZE = total_size };

    let request = ureq::get(url.as_str());

    let pb = ProgressBar::new(total_size);
    pb.set_style(ProgressStyle::default_bar().template("{spinner:.green} [{elapsed_precise}] [{bar:40.green/blue}] {bytes}/{total_bytes} ({eta})").progress_chars("#>-"));
    let file = Path::new(&filename);

    if file.exists() {
        return Ok(());
    }

    let resp = request.call().unwrap();
    let mut source = DownloadProgress {
        progress_bar: &pb,
        inner: resp.into_reader(),
    };

    let mut dest = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&file).unwrap();

    let _ = copy(&mut source, &mut dest).unwrap();
    if onlyaudio{    
        let inpath = Path::new(&filename);
        let mut outpathbuf = PathBuf::from(&filename);

        outpathbuf.set_extension("mp3");
        let outpath = &outpathbuf.as_path();

        ffmpeg::to_audio(inpath, outpath);

        fs::remove_file(&filename).unwrap();
    }

    unsafe {
            PROGRESS_SIZE_NOW = 0;
            TOTAL_PROGRESS_SIZE = 0;
    }
    Ok(())
}

#[tauri::command]
async fn merge(videofile: String, audiofile: String, filename: String) {
    let videopath = Path::new(&videofile);
    let audiopath = Path::new(&audiofile);
    let mut outpathbuf = PathBuf::from(&filename);
    outpathbuf.set_extension("mp4");
    let outpath = &outpathbuf.as_path();

    ffmpeg::merge(videopath, audiopath, outpath);
}

#[tauri::command]
fn get_bar_total_size() -> String {
    unsafe { TOTAL_PROGRESS_SIZE.to_string().into() }
}

#[tauri::command]
fn get_bar_size_now() -> String {
    unsafe { PROGRESS_SIZE_NOW.to_string().into() }
}
