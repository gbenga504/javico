#!/usr/bin/env bash

rm -rf ./build
react-scripts build
cp ./_redirects ./build