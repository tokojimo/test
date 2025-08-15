export interface Mushroom {
  id: string;
  name: string;
  latin: string;
  edible: boolean;
  /** Category label (e.g. cèpe, girolle) used for filters */
  category?: string;
  /** Whether the species requires a premium account */
  premium?: boolean;
  /** Popularity score used for sorting */
  popularity?: number;
  season: string;
  habitat: string;
  weatherIdeal: string;
  description: string;
  culinary: string;
  cookingTips: string;
  dishes: string[];
  confusions: string[];
  picking: string;
  photo: string;
}

export interface Zone {
  id: string;
  name: string;
  score: number;
  species: Record<string, number>;
  trend: string;
  coords: [number, number];
}

export interface VisitHistory {
  id: string;
  date: string;
  rating: number;
  note: string;
  photos: string[];
}

export interface Spot {
  id: number;
  cover: string;
  photos: string[];
  name: string;
  species: string[];
  rating: number;
  last: string;
  location?: string;
  history: VisitHistory[];
  visits?: string[];
}
