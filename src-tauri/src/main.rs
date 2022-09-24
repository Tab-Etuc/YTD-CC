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

use tauri::Window;

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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            download_youtube,
            merge,
            get_bar_size_now,
            write_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}



#[tauri::command]
async fn download_youtube(window: Window, url: &str, filename: &str, outputpath: &str, onlyaudio: bool) -> Result<String, String> {
    let url = Url::parse(url).unwrap();
    
    let resp = ureq::get(url.as_str()).call().unwrap();
    // Find the video size:
    let total_size = resp
        .header("Content-Length")
        .unwrap_or("0")
        .parse::<u64>()
        .unwrap();

    let request = ureq::get(url.as_str());

    let pb = ProgressBar::new(total_size);
    pb.set_style(ProgressStyle::default_bar().template("{spinner:.green} [{elapsed_precise}] [{bar:40.green/blue}] {bytes}/{total_bytes} ({eta})").progress_chars("#>-"));
    let file_output_path = &(outputpath.to_owned() + filename);
    let file = Path::new(file_output_path);

    if file.exists() { return Ok("File exists.".to_string()) };
    println!("{}", &total_size);
    window.emit("inDownload", total_size ).unwrap();
    let resp = request.call().unwrap();
    let mut source = DownloadProgress {
        progress_bar: &pb,
        inner: resp.into_reader(),
    }; 

    let mut dest = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&file)
        .unwrap();

    let _ = copy(&mut source, &mut dest).unwrap();

    if onlyaudio {
        ffmpeg::to_audio(&file_output_path);
    }

    unsafe { PROGRESS_SIZE_NOW = 0 };
    Ok("Downloaded success.".to_string())
}

#[tauri::command]
async fn merge(videofile: String, audiofile: String, filename: String) {
    let videopath = Path::new(&videofile);
    let audiopath = Path::new(&audiofile);
    let outpath = Path::new(&filename);

    ffmpeg::merge(videopath, audiopath, outpath);
    fs::remove_file(&videopath).unwrap();
    fs::remove_file(&audiopath).unwrap();
}

#[tauri::command]
fn get_bar_size_now() -> String {
    unsafe { PROGRESS_SIZE_NOW.to_string().into() }
}

#[tauri::command]
fn write_file(path: PathBuf, contents: String) -> Result<(), String> {
    std::fs::create_dir_all(path.parent().unwrap()).unwrap();

    let result = std::fs::write(path, contents);
    if result.is_ok() {
        return Ok(result.unwrap());
    }
    return Err(result.unwrap_err().to_string());
}

