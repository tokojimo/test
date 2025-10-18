export type BoundingBox = [[number, number], [number, number]];

export type RasterLayer = {
  /** Stable identifier used for maplibre source/layer ids and tile folder naming */
  id: string;
  /** Human readable label shown in logs or future legends */
  title: string;
  /** Species identifiers that should display this raster layer */
  species: string[];
  /** Template URL pointing to the XYZ PNG or WEBP tiles */
  url: string;
  /** Inclusive zoom range supported by the tiles */
  minzoom: number;
  maxzoom: number;
  /** Default opacity applied to the raster tiles */
  opacity: number;
  /** Whether the layer is visible on load */
  isVisible: boolean;
  /** Bounding box expressed as [[minLon, minLat], [maxLon, maxLat]] */
  bounds: BoundingBox;
};

const baseUrl =
  import.meta.env.VITE_TILE_CDN_BASE_URL?.replace(/\/$/, "") ??
  "https://68f3c30043b68c1c1ad2a06e--famous-pothos-6309bc.netlify.app";

const parseBoundingBox = (value?: string): BoundingBox | null => {
  if (!value) return null;
  const parts = value
    .split(",")
    .map(v => Number.parseFloat(v.trim()))
    .filter(n => Number.isFinite(n));
  if (parts.length !== 4) return null;
  const [minLon, minLat, maxLon, maxLat] = parts as [number, number, number, number];
  return [
    [Math.min(minLon, maxLon), Math.min(minLat, maxLat)],
    [Math.max(minLon, maxLon), Math.max(minLat, maxLat)],
  ];
};

const overrideBounds = parseBoundingBox(import.meta.env.VITE_TILE_DEFAULT_BBOX);

export const FALLBACK_GRENOBLE_BOUNDS: BoundingBox = [
  [5.507812, 44.706649],
  [7.558594, 45.992813],
];

export const DEFAULT_VIEW_BOUNDS = overrideBounds ?? FALLBACK_GRENOBLE_BOUNDS;

export const RASTER_LAYERS: RasterLayer[] = [
  {
    id: "boletus-edulis",
    title: "Boletus edulis suitability",
    species: ["boletus_edulis"],
    url: `${baseUrl}/boletus_edulis/tiles/{z}/{x}/{y}.png`,
    minzoom: 6,
    maxzoom: 16,
    opacity: 0.7,
    isVisible: true,
    bounds: FALLBACK_GRENOBLE_BOUNDS,
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

export const effectiveBounds = combinedBounds ?? DEFAULT_VIEW_BOUNDS;
