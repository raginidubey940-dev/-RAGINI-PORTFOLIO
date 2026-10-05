@echo off
title Launching AI & ML Student Portfolio
echo ============================================================
echo Opening 1st Year B.Tech CSE (AI & ML) Portfolio - JECRC University
echo ============================================================

set HTML_PATH="%~dp0index.html"

REM Try Microsoft Edge
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" %HTML_PATH%
    exit /b
)

REM Try Google Chrome
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" %HTML_PATH%
    exit /b
)

REM Fallback to Windows default browser
start "" %HTML_PATH%
exit /b
