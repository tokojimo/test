#!/usr/bin/env python3
import json
import math
import subprocess
import sys
from pathlib import Path

if len(sys.argv) != 4:
    print("Usage: log_raster_metadata.py <cog-path> <min-zoom> <max-zoom>", file=sys.stderr)
    sys.exit(1)

cog_path = Path(sys.argv[1])
min_zoom = int(sys.argv[2])
max_zoom = int(sys.argv[3])

try:
    info = subprocess.check_output([
        "gdalinfo",
        "-json",
        str(cog_path),
    ], text=True)
except subprocess.CalledProcessError as exc:
    print(exc.output, file=sys.stderr)
    raise

data = json.loads(info)

wgs84_extent = data.get("wgs84Extent", {}).get("coordinates", [])
if not wgs84_extent:
    # Fall back to corner coordinates (already lat/lon when EPSG:4326, but we just project to lat/lon via gdaltransform)
    corners = data.get("cornerCoordinates", {})
    wgs84_extent = [[
        [corners.get("lowerLeft", [None, None])[0], corners.get("lowerLeft", [None, None])[1]],
        [corners.get("upperRight", [None, None])[0], corners.get("upperRight", [None, None])[1]],
    ]]

# Flatten polygon -> bbox
min_lon = min(pt[0] for ring in wgs84_extent for pt in ring)
min_lat = min(pt[1] for ring in wgs84_extent for pt in ring)
max_lon = max(pt[0] for ring in wgs84_extent for pt in ring)
max_lat = max(pt[1] for ring in wgs84_extent for pt in ring)

geo_transform = data.get("geoTransform", [])
if len(geo_transform) >= 6:
    pixel_size_x = abs(geo_transform[1])
    # Pixel size is already in target projection (EPSG:3857)
    earth_circumference = 2 * math.pi * 6378137
    zoom_from_resolution = math.log2(earth_circumference / (pixel_size_x * 256))
    suggested_max_zoom = round(zoom_from_resolution)
else:
    suggested_max_zoom = None

result = {
    "name": cog_path.stem,
    "path": str(cog_path),
    "bounds": {
        "wgs84": [
            [round(min_lon, 6), round(min_lat, 6)],
            [round(max_lon, 6), round(max_lat, 6)],
        ]
    },
    "zoom": {
        "configured": {
            "min": min_zoom,
            "max": max_zoom,
        },
        "suggestedMax": suggested_max_zoom,
    },
    "sizeBytes": Path(cog_path).stat().st_size,
}

json.dump(result, sys.stdout, indent=2)
sys.stdout.write("\n")
