/*
 * The contents of this file are subject to the terms of the
 * Common Development and Distribution License, Version 1.0 only
 * (the "License").  You may not use this file except in compliance
 * with the License.
 *
 * See the file LICENSE in this distribution for details.
 * A copy of the CDDL is also available via the Internet at
 * http://www.opensource.org/licenses/cddl1.txt
 *
 * When distributing Covered Code, include this CDDL HEADER in each
 * file and include the contents of the LICENSE file from this
 * distribution.
 */

// Yet Another Youtube Down Loader
// - main.rs file -

use anyhow::Result;
// use clap::{App, Arg};
use indicatif::{ProgressBar, ProgressStyle};
use std::{
    fs,
    io::{self, copy, Read},
    path::{Path, PathBuf},
};
use url::Url;

mod definitions;
mod ffmpeg;
mod handlers;

struct DownloadProgress<R> {
    inner: R,
    progress_bar: ProgressBar,
}

impl<R: Read> Read for DownloadProgress<R> {
    fn read(&mut self, buf: &mut [u8]) -> io::Result<usize> {
        self.inner.read(buf).map(|n| {
            self.progress_bar.inc(n as u64);
            n
        })
    }
}

pub fn download(url: &str, filename: &str) -> Result<()> {
    let url = Url::parse(url)?;
    let resp = ureq::get(url.as_str()).call()?;
    // Find the video size:
    let total_size = resp
        .header("Content-Length")
        .unwrap_or("0")
        .parse::<u64>()?;

    let mut request = ureq::get(url.as_str());

    // Display a progress bar:
    let pb = ProgressBar::new(total_size);
    pb.set_style(ProgressStyle::default_bar()
                 .template("{spinner:.green} [{elapsed_precise}] [{bar:40.green/blue}] {bytes}/{total_bytes} ({eta})")
                 .progress_chars("#>-"));

    let file = Path::new(filename);

    if file.exists() {
        // Continue the file:
        let size = file.metadata()?.len() - 1;
        // Override the range:
        request = ureq::get(url.as_str())
            .set("Range", &format!("bytes={}-", size))
            .to_owned();
        pb.inc(size);
    }

    let resp = request.call()?;
    let mut source = DownloadProgress {
        progress_bar: pb,
        inner: resp.into_reader(),
    };

    let mut dest = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&file)?;

    let _ = copy(&mut source, &mut dest)?;

    Ok(())
}

pub fn main(yturl: String) -> Result<()> {
    let in_url = yturl;
    println!("{}.",in_url);

    let onlyaudio = false;
    // let outputfile = true;
    // let audioformat = true;

    inventory::collect!(&'static dyn definitions::SiteDefinition);
    let mut site_def_found = false;

    for handler in inventory::iter::<&dyn definitions::SiteDefinition> {
        // "15:15 And he found a pair of eyes, scanning the directories for files."
        // https://kingjamesprogramming.tumblr.com/post/123368869357/1515-and-he-found-a-pair-of-eyes-scanning-the
        // ------------------------------------

        // Find a known handler for <in_url>:
        if !handler.can_handle_url(&in_url) {
            continue;
        }

        // This one is it.
        site_def_found = true;
        println!("Fetching from {}.", handler.display_name());
        let video_exists = handler.does_video_exist(&in_url)?;
        if !video_exists {
            println!("The video could not be found. Invalid link?");
        } else {
            let video_title = handler.find_video_title(&in_url);
            let vt = match video_title {
                Err(_e) => "".to_string(),
                Ok(title) => title,
            };

            // Usually, we already find errors here.

            if vt.is_empty() {
                println!("The video title could not be extracted. Invalid link?");
            } else {
                // if args.is_present("verbose") {
                    println!("Title: {}", vt);
                // }

                let url = handler.find_video_direct_url(&in_url, onlyaudio)?;
                let ext = handler.find_video_file_extension(&in_url, onlyaudio)?;

                // Now let's download it:
                let targetfile = format!(
                    "{}.{}",
                    vt.trim()
                        .replace(&['|', '\'', '\"', ':', '\'', '\\', '/'][..], r#""#),
                    ext
                );

                // if let Some(in_targetfile) = outputfile {
                //     targetfile = in_targetfile.to_string();
                // }
                // if args.is_present("verbose") {
                println!("Starting the download.");
                // }

                download(&url, &targetfile)?;

                // Convert the file if needed.
                let outputext = "mp3";
                // if let Some(in_outputext) = audioformat {
                //     outputext = &in_outputext;
                // }

                if onlyaudio && ext != outputext {
                    // if args.is_present("verbose") {
                    //     println!("Post-processing.");
                    // }

                    let inpath = Path::new(&targetfile);
                    let mut outpathbuf = PathBuf::from(&targetfile);
                    outpathbuf.set_extension(outputext);
                    let outpath = &outpathbuf.as_path();

                    ffmpeg::to_audio(inpath, outpath);

                    // Get rid of the evidence.
                    fs::remove_file(&targetfile)?;

                    // Success!
                    println!(
                        "\"{}\" successfully downloaded.",
                        outpathbuf
                            .into_os_string()
                            .into_string()
                            .unwrap_or_else(|_| targetfile.to_string())
                    );
                } else {
                    // ... just success!
                    println!("\"{}\" successfully downloaded.", &targetfile);
                }
            }

            // Stop looking for other handlers:
            break;
        }
    }

    if !site_def_found {
        println!(
            "yaydl could not find a site definition that would satisfy {}. Exiting.",
            in_url
        );
    }

    Ok(())
}
