import React, { useState } from 'react';
import { NumberField } from './NumberField';

type Props = {
  onChange: (lat: number, lng: number, radiusKm: number) => void;
};

export const MapAreaPicker: React.FC<Props> = ({ onChange }) => {
  const [lat, setLat] = useState(45.764); // Lyon
  const [lng, setLng] = useState(4.8357);
  const [radius, setRadius] = useState(10);
  return (
    <div className="space-y-2">
      <NumberField label="Latitude" value={lat} onChange={(v) => { setLat(v); onChange(v, lng, radius); }} />
      <NumberField label="Longitude" value={lng} onChange={(v) => { setLng(v); onChange(lat, v, radius); }} />
      <NumberField label="Rayon (km)" value={radius} onChange={(v) => { setRadius(v); onChange(lat, lng, v); }} />
    </div>
  );
};
