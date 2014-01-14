#!/bin/bash

git checkout gh-pages
git checkout master src/Zen.js
docco -o . src/Zen.js
mv Zen.html index.html
git rm -rf src/