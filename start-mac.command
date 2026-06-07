#!/bin/zsh
cd "$(dirname "$0")" || exit 1

if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [ -x "/Applications/Codex.app/Contents/Resources/node" ]; then
  NODE_BIN="/Applications/Codex.app/Contents/Resources/node"
else
  echo "Node.js was not found."
  echo "Install Node.js from https://nodejs.org/ or run this project inside Codex."
  exit 1
fi

echo "Using Node: $NODE_BIN"
echo "Starting LUXE MONTRE at http://localhost:8080/index.html"
exec "$NODE_BIN" server.js
