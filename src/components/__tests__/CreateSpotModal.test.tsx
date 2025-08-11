import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { AppProvider } from '@/context/AppContext';
import { CreateSpotModal } from '../CreateSpotModal';
import Logo from '@/assets/logo.png';

vi.mock('@/services/mapkit', () => ({
  loadMapKit: vi.fn(() => Promise.resolve()),
}));

describe('CreateSpotModal', () => {
  const addEventListener = vi.fn();

  beforeEach(() => {
    addEventListener.mockClear();
    (global as any).mapkit = {
      Map: class {
        center = { latitude: 0, longitude: 0 };
        addEventListener = addEventListener;
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
    };
  });

  it('shows logo pin and map move instruction', async () => {
    render(
      <AppProvider>
        <CreateSpotModal onClose={() => {}} onCreate={() => {}} />
      </AppProvider>
    );

    expect(
      screen.getByText('Déplacez la carte pour choisir la localisation')
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '' })).toHaveAttribute('src', Logo);
    await waitFor(() =>
      expect(addEventListener).toHaveBeenCalledWith(
        'regionDidChange',
        expect.any(Function)
      )
    );
  });
});

