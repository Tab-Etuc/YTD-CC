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
    path::{Path},
};
use url::Url;

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
pub fn main(url: &str, filename: &str) -> Result<()> {
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
