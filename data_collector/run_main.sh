#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
PYTHON_BIN="$SCRIPT_DIR/venv/bin/python"
MAIN_FILE="$SCRIPT_DIR/main.py"

if [ ! -x "$PYTHON_BIN" ]; then
    echo "Error: venv Python not found at $PYTHON_BIN" >&2
    echo "Create it with: python3 -m venv venv" >&2
    exit 1
fi

exec "$PYTHON_BIN" "$MAIN_FILE" "$@"