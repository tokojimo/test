# Backend Structure

This directory holds the backend service for the mushroom mapping project.  It is
currently a scaffold so you can begin wiring a real API without impacting the
front-end code in `src/`.

```
server/
├── README.md          # Overview and setup notes for the backend
├── rasters/           # Storage for GeoTIFF and other raster assets
└── src/               # Place your backend source code here (controllers, jobs, etc.)
```

## Getting Started

1. Implement your preferred backend stack inside the `src/` folder (for example,
   Express, Fastify, or another framework).
2. Keep configuration files (environment variables, ORM configs, migrations,
   etc.) alongside your code under `server/` so everything backend-related lives
   in one place.
3. Add any build or runtime scripts to `package.json` (or create a dedicated
   backend package) once you begin coding the API.

## Raster Storage

Place GeoTIFF or other raster files inside `server/rasters/`.  This keeps large
map assets out of the front-end bundle and makes it easy to serve or process
them from the backend.

Add subdirectories if you want to group rasters by region, season, or data
source.  Commit a `.gitignore` if the assets should not be versioned.
