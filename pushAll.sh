#!/usr/bin/env bash

cd note
git checkout main
git add .
git commit -m "update"
git push origin main
git pull

cd ..
git add .
git commit -m "update"
git push origin main
git pull
git submodule update --init

cd note
git checkout main

cd ..
git add .
git commit -m "update"
git push origin main