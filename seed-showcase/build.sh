#!/usr/bin/env bash
# Builds the SEED AGENCY watermarked preview from a finished copy of the site.
# usage: seed-showcase/build.sh <site dir> <output dir>
set -euo pipefail
src=$1 out=$2 here=$(dirname "$0")
rm -rf "$out" && cp -r "$src" "$out" && cp "$here/seed.css" "$out/"
for f in "$out"/*.html; do
  sed -i \
    -e 's|</head>|<meta name="robots" content="noindex, nofollow"><link rel="stylesheet" href="seed.css"></head>|' \
    -e 's|<body>|<body><div class="seed-badge" aria-hidden="true">Concept by SEED AGENCY · Preview only</div>|' \
    -e 's|<title>|<title>SEED AGENCY preview · |' \
    -e 's|<meta property="og:title" content="|&SEED AGENCY preview · |' "$f"
done
# the preview collects nobody's details: the form explains itself instead of sending
sed -i -e 's| data-netlify="true" netlify-honeypot="bot-field" data-endpoint="/"| data-endpoint="" onsubmit="event.preventDefault();this.querySelector(\x27[data-form-status]\x27).textContent=\x27Preview only: this form goes live with the finished site.\x27"|' "$out/index.html"
grep -q 'seed.css' "$out/index.html" && ! grep -q 'data-netlify' "$out/index.html" && echo "preview built in $out"
