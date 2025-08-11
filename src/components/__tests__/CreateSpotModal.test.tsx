import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { AppProvider } from '@/context/AppContext';
import { CreateSpotModal } from '../CreateSpotModal';
import Logo from '/Logo.png';

vi.mock('@/services/mapkit', () => ({
  loadMapKit: vi.fn(() => Promise.resolve()),
}));

describe('CreateSpotModal', () => {
  const MarkerAnnotation = vi.fn();

  beforeEach(() => {
    MarkerAnnotation.mockClear();
    (global as any).mapkit = {
      Map: class {
        center = { latitude: 0, longitude: 0 };
        addAnnotation = vi.fn();
        removeAnnotation = vi.fn();
        addEventListener = vi.fn();
        destroy = vi.fn();
      },
      Coordinate: class {
        latitude: number;
        longitude: number;
        constructor(lat: number, lng: number) {
          this.latitude = lat;
          this.longitude = lng;
        }
      },
      CoordinateRegion: class {},
      CoordinateSpan: class {},
      MarkerAnnotation: MarkerAnnotation,
      Image: class {
        image: string;
        constructor(src: string) {
          this.image = src;
        }
      },
    };
  });

  it('uses app logo for marker and shows map click instruction', async () => {
    render(
      <AppProvider>
        <CreateSpotModal onClose={() => {}} onCreate={() => {}} />
      </AppProvider>
    );

    await waitFor(() => expect(MarkerAnnotation).toHaveBeenCalled());
    const [, options] = MarkerAnnotation.mock.calls[0];
    expect(options.glyphImage.image).toBe(Logo);

    expect(
      screen.getByText('Cliquez sur la carte pour choisir la localisation')
    ).toBeInTheDocument();
  });
});

