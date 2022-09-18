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
// - ffmpeg.rs file -

use std::path::Path;
use std::process::Command;

// It makes very little sense to link ffmpeg statically with yaydl.
// Just use the system's one (or inform the user if there isn't one).

pub fn to_audio(path: &str) {
    Command::new("ffmpeg")
        .arg("-i")
        .arg(path)
        .arg("-vn") // Skip the video streams.
        .arg("-loglevel")
        .arg("quiet") // Shut the fuck up. // O_O
        .arg(path)
        .output()
        .expect("Could not find ffmpeg - no processing is done.");
}

pub fn merge(videofile: &Path, audiofile: &Path, filename: &Path) {
    Command::new("ffmpeg")
        .arg("-i")
        .arg(videofile)
        .arg("-i")
        .arg(audiofile)
        .arg("-c:v")
        .arg("copy")
        .arg("-c:a")
        .arg("aac")
        .arg("-loglevel")
        .arg("quiet")
        .arg(filename)
        .output()
        .expect("Could not find ffmpeg - no processing is done.");
}
