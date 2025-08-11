import { describe, it, expect, vi } from 'vitest';
import { fetchJSON, loadMushrooms } from './dataLoader';

describe('dataLoader', () => {
  it('handles network errors and fallbacks', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network down'));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchJSON('/test')).rejects.toThrow(/Network error/);

    const fallback = [{ id: '1' }];
    const res = await fetchJSON('/test', fallback);
    expect(res).toEqual(fallback);

    await expect(loadMushrooms()).rejects.toThrow(/Network error/);

    vi.unstubAllGlobals();
  });
});
