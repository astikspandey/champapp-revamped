#!/bin/bash

echo "🎨 Building CSS with Tailwind..."
npx tailwindcss -c ./tailwind.config.js -i ./client/src/index.css -o ./dist/public/main.css

echo "🔨 Building JS with esbuild..."
node script/build-client.js

echo "✅ Build complete!"
