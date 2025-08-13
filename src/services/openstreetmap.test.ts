// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
vi.mock('maplibre-gl', () => ({}));
import { reverseGeocode } from './openstreetmap';
import { getStaticMapUrl } from './staticMap';
import { createCanvas, loadImage } from '@napi-rs/canvas';

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
  it('centers image on provided coordinates', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      const parts = url.split('/');
      const x = parseInt(parts[parts.length - 2], 10);
      const y = parseInt(parts[parts.length - 1].replace('.png', ''), 10);
      const canvas = createCanvas(256, 256);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = `rgb(${x % 256},${y % 256},0)`;
      ctx.fillRect(0, 0, 256, 256);
      const buf = canvas.toBuffer('image/png');
      return {
        ok: true,
        arrayBuffer: async () => buf,
      } as any;
    });
    vi.stubGlobal('fetch', fetchMock);
    const url = await getStaticMapUrl(0, 0, 512, 512, 2);
    const img = await loadImage(Buffer.from(url.split(',')[1], 'base64'));
    const c = createCanvas(512, 512);
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(256, 256, 1, 1).data;
    expect([data[0], data[1]]).toEqual([2, 2]);
    vi.unstubAllGlobals();
  });
});
