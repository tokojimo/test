import { describe, it, expect, vi } from 'vitest';
vi.mock('maplibre-gl', () => ({}));
import { reverseGeocode, getStaticMapUrl } from './openstreetmap';

describe('reverseGeocode', () => {
  it('returns nearest place name', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ address: { village: 'Renage' } })
    } as any);
    vi.stubGlobal('fetch', fetchMock);
    const name = await reverseGeocode(45, 5);
    expect(name).toBe('Renage');
    vi.unstubAllGlobals();
  });

  it('returns null on error', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network'));
    vi.stubGlobal('fetch', fetchMock);
    const name = await reverseGeocode(0, 0);
    expect(name).toBeNull();
    vi.unstubAllGlobals();
  });
});

describe('getStaticMapUrl', () => {
  it('builds a Carto tile URL keeping map style', () => {
    const url = getStaticMapUrl(48.8566, 2.3522, 400, 200, 13);
    expect(url).toMatch(/^https:\/\/[abcd]\.basemaps\.cartocdn\.com\/light_all\/13\/4150\/2818@2x\.png$/);
  });
});
