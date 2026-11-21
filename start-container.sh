#!/bin/sh
set -eu
state_dir="${DATA_DIR:-${RAILWAY_VOLUME_MOUNT_PATH:-/app/data}}"
mkdir -p "$state_dir"
chown node:node "$state_dir"
exec su-exec node:node node /app/server.js
