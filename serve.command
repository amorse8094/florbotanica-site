#!/bin/bash
cd "$(dirname "$0")"
PORT=8900
URL="http://localhost:$PORT/"
echo "Serving $(pwd)"
echo "Open $URL"
(sleep 1 && open "$URL") &
python3 -m http.server $PORT
