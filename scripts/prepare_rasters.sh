#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <output-root> <input.tif> [<input2.tif> ...]" >&2
  echo "Example: $0 build tiles/mushroom_suitability.tif" >&2
  exit 1
fi

OUTPUT_ROOT=$1
shift

mkdir -p "$OUTPUT_ROOT"

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
LOG_SCRIPT="$SCRIPT_DIR/log_raster_metadata.py"

for INPUT in "$@"; do
  if [ ! -f "$INPUT" ]; then
    echo "Input file not found: $INPUT" >&2
    exit 1
  fi

  BASENAME=$(basename "$INPUT")
  NAME="${BASENAME%.*}"
  WORKDIR="$OUTPUT_ROOT/$NAME"
  TILE_DIR="$OUTPUT_ROOT/tiles/$NAME"
  mkdir -p "$WORKDIR" "$TILE_DIR"

  REPROJECTED="$WORKDIR/${NAME}_3857.tif"
  COG="$WORKDIR/${NAME}.cog.tif"

  echo "➡️ Reprojecting $INPUT to EPSG:3857 -> $REPROJECTED"
  gdalwarp \
    -t_srs EPSG:3857 \
    -r bilinear \
    -multi \
    -wo NUM_THREADS=ALL_CPUS \
    -dstalpha \
    -co COMPRESS=DEFLATE \
    -co TILED=YES \
    "$INPUT" "$REPROJECTED"

  echo "➡️ Converting $REPROJECTED to Cloud Optimized GeoTIFF -> $COG"
  gdal_translate \
    -of COG \
    -co COMPRESS=DEFLATE \
    -co PREDICTOR=2 \
    -co RESAMPLING=AVERAGE \
    -co BLOCKSIZE=512 \
    -co NBITS=8 \
    "$REPROJECTED" "$COG"

  echo "➡️ Building internal overviews"
  gdaladdo -r average "$COG" 2 4 8 16 32 || true

  echo "➡️ Generating XYZ tiles (z6-z16) in $TILE_DIR"
  gdal2tiles.py \
    --xyz \
    -z 6-16 \
    -w none \
    --processes "$(nproc --ignore=1 2>/dev/null || echo 1)" \
    "$COG" "$TILE_DIR"

  echo "➡️ Logging metadata"
  python3 "$LOG_SCRIPT" "$COG" 6 16 > "$WORKDIR/metadata.json"
  cat "$WORKDIR/metadata.json"

  echo "✅ Finished $INPUT"
  echo

done

echo "All rasters processed. Upload the contents of '$OUTPUT_ROOT/tiles' to your CDN."
