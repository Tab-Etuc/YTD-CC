#!/bin/bash
# YTD-CC Sidecar 下載腳本 (Linux/macOS)
# 下載 yt-dlp 和 ffmpeg 執行檔到 src-tauri 目錄

set -e

# 設定顏色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 取得腳本所在目錄
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TAURI_DIR="$PROJECT_ROOT/src-tauri"

echo -e "${CYAN}======================================${NC}"
echo -e "${CYAN}  YTD-CC Sidecar Downloader${NC}"
echo -e "${CYAN}======================================${NC}"
echo ""

# 確保目標目錄存在
if [ ! -d "$TAURI_DIR" ]; then
    echo -e "${RED}Error: src-tauri directory not found!${NC}"
    exit 1
fi

cd "$TAURI_DIR"

# 偵測作業系統
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
    Darwin)
        PLATFORM="macos"
        if [ "$ARCH" == "arm64" ]; then
            TARGET="aarch64-apple-darwin"
        else
            TARGET="x86_64-apple-darwin"
        fi
        ;;
    Linux)
        PLATFORM="linux"
        TARGET="x86_64-unknown-linux-gnu"
        ;;
    *)
        echo -e "${RED}Unsupported platform: $OS${NC}"
        exit 1
        ;;
esac

echo -e "Detected platform: ${YELLOW}$PLATFORM ($TARGET)${NC}"
echo ""

# ============================
# 下載 yt-dlp
# ============================
YTDLP_FILE="yt-dlp-$TARGET"

echo -e "${YELLOW}[1/2] Downloading yt-dlp...${NC}"

if [ -f "$YTDLP_FILE" ]; then
    echo -e "  -> $YTDLP_FILE already exists, skipping..."
else
    if [ "$PLATFORM" == "macos" ]; then
        curl -L -o "$YTDLP_FILE" "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos"
    else
        curl -L -o "$YTDLP_FILE" "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp"
    fi
    chmod +x "$YTDLP_FILE"
    echo -e "  -> ${GREEN}Downloaded $YTDLP_FILE successfully!${NC}"
fi

# ============================
# 下載 ffmpeg
# ============================
FFMPEG_FILE="ffmpeg-$TARGET"

echo -e "${YELLOW}[2/2] Downloading ffmpeg...${NC}"

if [ -f "$FFMPEG_FILE" ]; then
    echo -e "  -> $FFMPEG_FILE already exists, skipping..."
else
    if [ "$PLATFORM" == "macos" ]; then
        curl -L -o ffmpeg.zip "https://evermeet.cx/ffmpeg/getrelease/zip"
        unzip -o ffmpeg.zip
        mv ffmpeg "$FFMPEG_FILE"
        rm ffmpeg.zip
    else
        curl -L -o ffmpeg.tar.xz "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz"
        tar -xf ffmpeg.tar.xz --wildcards "*/ffmpeg" --strip-components=1
        mv ffmpeg "$FFMPEG_FILE"
        rm ffmpeg.tar.xz
    fi
    chmod +x "$FFMPEG_FILE"
    echo -e "  -> ${GREEN}Downloaded $FFMPEG_FILE successfully!${NC}"
fi

# ============================
# 完成
# ============================
echo ""
echo -e "${CYAN}======================================${NC}"
echo -e "${GREEN}  All sidecars downloaded!${NC}"
echo -e "${CYAN}======================================${NC}"
echo ""
echo "Files in src-tauri:"
ls -lh "$TAURI_DIR" | grep -E "yt-dlp|ffmpeg" | awk '{print "  - " $9 " (" $5 ")"}'
echo ""
echo -e "${YELLOW}You can now run 'yarn tauri dev' to start development!${NC}"
