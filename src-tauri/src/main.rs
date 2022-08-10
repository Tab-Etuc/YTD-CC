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

use tauri::{Manager, Window};
// use window_vibrancy::{self, NSVisualEffectMaterial};

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
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            window.set_decorations(false)?;

            // #[cfg(target_os = "macos")]
            // window_vibrancy::apply_vibrancy(&window, NSVisualEffectMaterial::AppearanceBased).expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
            
            // #[cfg(target_os = "windows")]
            // window_vibrancy::apply_blur(&window, Some((18, 18, 18, 125))).expect("Unsupported platform! 'apply_blur' is only supported on Windows");
            Ok(())
        }
        )
        .invoke_handler(tauri::generate_handler![
            download_youtube,
            merge,
            get_bar_size_now
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}



#[tauri::command]
async fn download_youtube(window: Window, url: &str, filename: &str, onlyaudio: bool) -> Result<(), String> {
    let url = Url::parse(url).unwrap();
    
    let resp = ureq::get(url.as_str()).call().unwrap();
    // Find the video size:
    let total_size = resp
        .header("Content-Length")
        .unwrap_or("0")
        .parse::<u64>()
        .unwrap();

    window.emit("inDownload", total_size ).unwrap();

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
        .open(&file)
        .unwrap();

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
    fs::remove_file(&videopath).unwrap();
    fs::remove_file(&audiopath).unwrap();
}

#[tauri::command]
fn get_bar_size_now() -> String {
    unsafe { PROGRESS_SIZE_NOW.to_string().into() }
}
