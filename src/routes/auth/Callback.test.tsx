import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

vi.mock('@/lib/auth', () => ({
  getSession: vi.fn(),
}));

import Callback from './Callback';
import { ToastProvider } from '../../components/settings/Toasts';
import { AppProvider } from '../../context/AppContext';
import { useSettingsStore } from '../../stores/settings';
import * as auth from '@/lib/auth';

function renderComp() {
  return render(
    <AppProvider>
      <ToastProvider>
        <Callback />
      </ToastProvider>
    </AppProvider>
  );
}

describe('Callback route', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    useSettingsStore.getState().update({ account: { session: 'disconnected' } });
  });

  it('redirects when session present', async () => {
    vi.mocked(auth.getSession).mockResolvedValue({ user: { email: 'a@b.c' } } as any);
    renderComp();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/settings#compte'));
    expect(useSettingsStore.getState().account.session).toBe('connected');
  });

  it('handles missing session', async () => {
    vi.mocked(auth.getSession).mockResolvedValue(null);
    renderComp();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });
});
