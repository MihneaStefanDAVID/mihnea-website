#!/bin/zsh
cd -- "$(dirname -- "$0")"
node tools/build-teaching-library.mjs
echo
echo "Teaching materials are now up to date. You can close this window."
