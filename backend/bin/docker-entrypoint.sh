#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /app/backend/tmp/pids/server.pid

# Compile Othello AI binary
echo "Compiling Othello AI (v1)..."
cd /app/backend
if [ -f "othelloai_logic/v1/othello.cpp" ]; then
    g++ -O3 -o othelloai_logic/v1/othello othelloai_logic/v1/othello.cpp
    chmod +x othelloai_logic/v1/othello
    echo "Compilation successful."
else
    echo "Warning: othelloai_logic/v1/othello.cpp not found."
fi

# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
