# YTD-CC Sidecar 下載腳本 (Windows PowerShell)
# 下載 yt-dlp 和 ffmpeg 執行檔到 src-tauri 目錄

$ErrorActionPreference = "Stop"

# 設定目錄
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$tauriDir = Join-Path $projectRoot "src-tauri"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  YTD-CC Sidecar Downloader" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 確保目標目錄存在
if (-not (Test-Path $tauriDir)) {
    Write-Host "Error: src-tauri directory not found!" -ForegroundColor Red
    exit 1
}

Set-Location $tauriDir

# ============================
# 下載 yt-dlp
# ============================
$ytdlpFile = "yt-dlp-x86_64-pc-windows-msvc.exe"
$ytdlpUrl = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe"

Write-Host "[1/2] Downloading yt-dlp..." -ForegroundColor Yellow

if (Test-Path $ytdlpFile) {
    Write-Host "  -> $ytdlpFile already exists, skipping..." -ForegroundColor Gray
} else {
    try {
        Invoke-WebRequest -Uri $ytdlpUrl -OutFile $ytdlpFile -UseBasicParsing
        Write-Host "  -> Downloaded $ytdlpFile successfully!" -ForegroundColor Green
    } catch {
        Write-Host "  -> Failed to download yt-dlp: $_" -ForegroundColor Red
        exit 1
    }
}

# ============================
# 下載 ffmpeg
# ============================
$ffmpegFile = "ffmpeg-x86_64-pc-windows-msvc.exe"
$ffmpegZipUrl = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"
$ffmpegZip = "ffmpeg-temp.zip"

Write-Host "[2/2] Downloading ffmpeg..." -ForegroundColor Yellow

if (Test-Path $ffmpegFile) {
    Write-Host "  -> $ffmpegFile already exists, skipping..." -ForegroundColor Gray
} else {
    try {
        # 下載 zip
        Write-Host "  -> Downloading ffmpeg archive..." -ForegroundColor Gray
        Invoke-WebRequest -Uri $ffmpegZipUrl -OutFile $ffmpegZip -UseBasicParsing
        
        # 解壓縮
        Write-Host "  -> Extracting ffmpeg.exe..." -ForegroundColor Gray
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        $zip = [System.IO.Compression.ZipFile]::OpenRead($ffmpegZip)
        
        $ffmpegEntry = $zip.Entries | Where-Object { $_.Name -eq "ffmpeg.exe" } | Select-Object -First 1
        
        if ($ffmpegEntry) {
            [System.IO.Compression.ZipFileExtensions]::ExtractToFile($ffmpegEntry, $ffmpegFile, $true)
            Write-Host "  -> Downloaded $ffmpegFile successfully!" -ForegroundColor Green
        } else {
            Write-Host "  -> ffmpeg.exe not found in archive!" -ForegroundColor Red
            exit 1
        }
        
        $zip.Dispose()
        
        # 清理暫存檔
        Remove-Item $ffmpegZip -Force
        
    } catch {
        Write-Host "  -> Failed to download ffmpeg: $_" -ForegroundColor Red
        if (Test-Path $ffmpegZip) { Remove-Item $ffmpegZip -Force }
        exit 1
    }
}

# ============================
# 完成
# ============================
Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  All sidecars downloaded!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files in src-tauri:" -ForegroundColor Gray

Get-ChildItem -Path $tauriDir -Filter "*.exe" | ForEach-Object {
    $size = [math]::Round($_.Length / 1MB, 2)
    Write-Host "  - $($_.Name) ($size MB)" -ForegroundColor White
}

Write-Host ""
Write-Host "You can now run 'yarn tauri dev' to start development!" -ForegroundColor Yellow
