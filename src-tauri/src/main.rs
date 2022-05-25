#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod yaydl;
mod ffmpeg;
use tauri::api::http::{ HttpRequestBuilder, ResponseType, ClientBuilder, Body, ResponseData };

use anyhow::Result;
use std::collections::HashMap;
use std::{
  fs,
  path::{Path, PathBuf},
};


fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![download_yt,web_request])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn download_yt(url: &str, filename: &str, onlyaudio: bool, outputext: &str) -> Result<(), ()> {
  yaydl::main(url, filename);
  if onlyaudio {
    let inpath = Path::new(&filename);
    let mut outpathbuf = PathBuf::from(&filename);
    outpathbuf.set_extension(outputext);
    let outpath = &outpathbuf.as_path();

    ffmpeg::to_audio(inpath, outpath);

    // Get rid of the evidence.
    fs::remove_file(&filename);

    // Success!
    println!(
        "\"{}\" successfully downloaded.",
        outpathbuf
            .into_os_string()
            .into_string()
            .unwrap_or_else(|_| filename.to_string())
    );
  Ok(())
    
} else {
    // ... just success!
    println!("\"{}\" successfully downloaded.", &filename);
    Ok(())
}
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

