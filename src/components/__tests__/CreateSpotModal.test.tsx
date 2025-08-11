import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { AppProvider } from '@/context/AppContext';
import { CreateSpotModal } from '../CreateSpotModal';
import Logo from '@/assets/logo.png';

const addEventListener = vi.fn();

vi.mock('@/services/openstreetmap', () => ({
  loadMap: vi.fn(async () => ({
    Map: class {
      on = addEventListener;
      remove = vi.fn();
      getCenter() {
        return { lat: 0, lng: 0 };
      }
      scrollZoom = { disable: vi.fn() };
      doubleClickZoom = { disable: vi.fn() };
      touchZoomRotate = { disable: vi.fn() };
      getCanvas() {
        return { toDataURL: vi.fn(() => 'data:image/png;base64,test') };
      }
    },
  })),
}));

describe('CreateSpotModal', () => {

  beforeEach(() => {
    addEventListener.mockClear();
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
        'moveend',
        expect.any(Function)
      )
    );
  });
});

