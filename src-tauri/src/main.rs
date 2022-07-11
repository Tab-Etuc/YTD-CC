#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod ffmpeg;

use anyhow::Result;
use std::{
    collections::HashMap,
    fs,
    io::{self, copy, Read},
    path::{Path, PathBuf},
};
use tauri::api::http::{Body, ClientBuilder, HttpRequestBuilder, ResponseData, ResponseType};

use indicatif::{ProgressBar, ProgressStyle};
use url::Url;

struct DownloadProgress<R> {
    inner: R,
    progress_bar: ProgressBar,
}

static mut progress_size_now: usize = 0;
static mut total_progress_size: u64 = 0;

impl<R: Read> Read for DownloadProgress<R> {
    fn read(&mut self, buf: &mut [u8]) -> io::Result<usize> {
        self.inner.read(buf).map(|n| {
            self.progress_bar.inc(n as u64);
            unsafe {
                progress_size_now += n;
                println!("{}", progress_size_now)
            };
            n
        })
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            download_yt,
            web_request,
            get_bar_total_size,
            get_bar_size_now
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn download_yt(
    url: &str,
    filename: &str,
    onlyaudio: bool,
    outputext: &str,
) -> Result<(), ()> {
    let url = Url::parse(url).unwrap();
    let resp = ureq::get(url.as_str()).call().unwrap();
    // Find the video size:
    let total_size = resp
        .header("Content-Length")
        .unwrap_or("0")
        .parse::<u64>()
        .unwrap();
    unsafe { total_progress_size = total_size };

    let mut request = ureq::get(url.as_str());

    // Display a progress bar:
    let pb = ProgressBar::new(total_size);
    pb.set_style(ProgressStyle::default_bar()
               .template("{spinner:.green} [{elapsed_precise}] [{bar:40.green/blue}] {bytes}/{total_bytes} ({eta})")
               .progress_chars("#>-"));

    let file = Path::new(filename);

    if file.exists() {
        // Continue the file:
        let size = file.metadata().unwrap().len() - 1;
        // Override the range:
        request = ureq::get(url.as_str())
            .set("Range", &format!("bytes={}-", size))
            .to_owned();
        pb.inc(size);
    }

    let resp = request.call().unwrap();
    let mut source = DownloadProgress {
        progress_bar: pb,
        inner: resp.into_reader(),
    };

    let mut dest = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&file)
        .unwrap();

    let _ = copy(&mut source, &mut dest).unwrap();

    if onlyaudio {
        let inpath = Path::new(&filename);
        let mut outpathbuf = PathBuf::from(&filename);
        outpathbuf.set_extension(outputext);
        let outpath = &outpathbuf.as_path();

        ffmpeg::to_audio(inpath, outpath);

        // Get rid of the evidence.
        fs::remove_file(&filename);

        // Success!
        unsafe {
            progress_size_now = 0;
            total_progress_size = 0;
        }
        Ok(())
    } else {
        unsafe {
            progress_size_now = 0;
            total_progress_size = 0;
        }
        Ok(())
    }
}

#[tauri::command]
fn get_bar_total_size() -> String {
    unsafe { total_progress_size.to_string().into() }
}

#[tauri::command]
fn get_bar_size_now() -> String {
    unsafe { progress_size_now.to_string().into() }
}

#[tauri::command]
async fn web_request(
    url: String,
    method: String,
    body: Body,
    query: HashMap<String, String>,
    headers: HashMap<String, String>,
    response_type: ResponseType,
) -> Result<ResponseData, String> {
    let method = &method;
    let client = ClientBuilder::new().max_redirections(3).build().unwrap();
    let mut request_builder = HttpRequestBuilder::new(method, url)
        .unwrap()
        .query(query)
        .headers(headers);

    if method.eq("POST") {
        request_builder = request_builder.body(body);
    }

    let request = request_builder.response_type(response_type);
    if let Ok(response) = client.send(request).await {
        if let Ok(result) = response.read().await {
            return Ok(result);
        }
        return Err("response read failed".into());
    }
    return Err("web request failed".into());
}
