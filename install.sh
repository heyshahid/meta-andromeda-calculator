#!/usr/bin/env bash
# Meta Andromeda Calculator - Linux & macOS Launcher
# Copyright (c) 2026 Shahid Akram

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "=========================================================="
echo " 🚀 Meta Andromeda ROAS & Scaling Suite"
echo " Author: Shahid Akram | https://github.com/heyshahid"
echo "=========================================================="

if command -v open &>/dev/null; then
    open "${DIR}/index.html"
elif command -v xdg-open &>/dev/null; then
    xdg-open "${DIR}/index.html"
else
    echo "Please open ${DIR}/index.html in any browser."
fi
