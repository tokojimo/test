import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect } from 'vitest';

import MapScene from '../MapScene';
import { AppProvider } from '@/context/AppContext';

// Hoist mocks for framer-motion
const { motionSection, motionButton } = vi.hoisted(() => ({
  motionSection: vi.fn((props: any) => <section {...props} />),
  motionButton: vi.fn((props: any) => <button {...props} />),
}));

vi.mock('framer-motion', () => ({
  motion: {
    section: motionSection,
    button: motionButton,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

let mapInstance: any;

// Mock OpenStreetMap services
vi.mock('../../services/openstreetmap', () => {
  class Map {
    handlers: Record<string, any> = {};
    constructor() {
      mapInstance = this;
    }
    on(event: string, cb: any) {
      this.handlers[event] = cb;
    }
    getCanvas() {
      return { style: {} } as any;
    }
    flyTo() {}
    remove() {}
  }
  class Marker {
    constructor() {}
    setLngLat() { return this; }
    addTo() { return this; }
    remove() {}
  }
  return {
    loadMap: vi.fn(() => Promise.resolve({ Map, Marker })),
    geocode: vi.fn(),
    reverseGeocode: vi.fn(() => Promise.resolve('Testville')),
  };
});

describe('MapScene', () => {
  it('opens zone when toast is clicked', async () => {
    const onZone = vi.fn();
    render(
      <AppProvider>
        <MapScene onZone={onZone} gpsFollow={false} setGpsFollow={() => {}} onBack={() => {}} />
      </AppProvider>
    );

    // Wait for map to initialize then simulate a click near a known zone
    await new Promise(r => setTimeout(r, 0));
    mapInstance.handlers.click({ lngLat: { lat: 45.7, lng: 5.9 } });

    const toast = await screen.findByRole('button', { name: /Testville/ });
    fireEvent.click(toast);

    expect(onZone).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Testville', coords: [45.7, 5.9] })
    );
  });
});
