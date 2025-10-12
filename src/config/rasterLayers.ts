export type BoundingBox = [[number, number], [number, number]];

export type RasterLayer = {
  /** Stable identifier used for maplibre source/layer ids and tile folder naming */
  id: string;
  /** Human readable label shown in logs or future legends */
  name: string;
  /** Template URL pointing to the XYZ PNG tiles */
  tiles: string;
  /** Inclusive zoom range supported by the tiles */
  minzoom: number;
  maxzoom: number;
  /** Bounding box expressed as [[minLon, minLat], [maxLon, maxLat]] */
  bounds: BoundingBox;
};

const baseUrl = import.meta.env.VITE_TILE_CDN_BASE_URL?.replace(/\/$/, "") ?? "https://cdn.example.com";

export const RASTER_LAYERS: RasterLayer[] = [
  {
    id: "boletus_edulis_suitability_styled",
    name: "Boletus edulis – aptitude",
    tiles: `${baseUrl}/tiles/boletus_edulis_suitability_styled/{z}/{x}/{y}.png`,
    minzoom: 6,
    maxzoom: 16,
    bounds: [
      [5.507812, 44.706649],
      [7.558594, 45.992813],
    ],
  },
];

export const combinedBounds = RASTER_LAYERS.reduce<BoundingBox | null>((acc, layer) => {
  if (!acc)
    return [
      [...layer.bounds[0]] as [number, number],
      [...layer.bounds[1]] as [number, number],
    ];
  return [
    [Math.min(acc[0][0], layer.bounds[0][0]), Math.min(acc[0][1], layer.bounds[0][1])],
    [Math.max(acc[1][0], layer.bounds[1][0]), Math.max(acc[1][1], layer.bounds[1][1])],
  ];
}, null);
