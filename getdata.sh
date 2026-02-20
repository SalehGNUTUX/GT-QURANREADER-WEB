#!/bin/bash

mkdir data &&
cd data &&
wget https://api.alquran.cloud/v1/quran/quran-uthmani &&
jq .data.surahs --compact-output < quran-uthmani | zstd -19 -o quran-uthmani-surahs.zst &&
rm -f quran-uthmani
