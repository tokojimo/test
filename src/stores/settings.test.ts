import { describe, it, expect } from 'vitest';
import { act } from '@testing-library/react';
import { useSettingsStore } from './settings';

describe('settings store', () => {
  it('updates alerts', () => {
    const { update, alerts } = useSettingsStore.getState();
    expect(alerts.optimum).toBe(false);
    act(() => update({ alerts: { optimum: true, newZone: false } }));
    expect(useSettingsStore.getState().alerts.optimum).toBe(true);
  });
});
