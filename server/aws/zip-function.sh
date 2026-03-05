#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

cd ..
echo "Building distribution..."
pnpm install
pnpm build

echo "Cleaning up mode_modules - removing non-production ones..."
rm -rf node_modules
pnpm install --prod --node-linker=hoisted

echo "Building widget..."
cd ../widget
pnpm install
pnpm build
mkdir -p ../server/dist/www
cp -R dist/. ../server/dist/www

echo "Creating upload zipfile..."
cd ../server
rm -f aws/function.zip
cp index.js index.mjs
zip -r aws/function.zip \
    package.json \
    index.mjs \
    dist/* \
    node_modules \
    -x '*@aws-sdk*'

echo "Done!"
