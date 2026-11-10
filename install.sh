#!/usr/bin/env bash
# Open MarketingOps - Linux & macOS Launcher
# Copyright (c) 2026 Shahid Akram

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "=========================================================="
echo " 🚀 Open MarketingOps Suite v1.0.0"
echo " Understand Performance. Make Better Decisions. Scale Smarter."
echo " Author: Shahid Akram | https://github.com/heyshahid"
echo "=========================================================="

echo -e "\n[*] Launching Open MarketingOps in your default browser..."

if which xdg-open > /dev/null; then
    xdg-open "$SCRIPT_DIR/index.html"
elif which open > /dev/null; then
    open "$SCRIPT_DIR/index.html"
else
    echo "Please open $SCRIPT_DIR/index.html in your web browser."
fi
