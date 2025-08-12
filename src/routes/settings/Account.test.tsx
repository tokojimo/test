import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
vi.mock('@/lib/auth', () => ({
  signInGoogle: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
}));
import Account from './Account';
import { ToastProvider } from '../../components/settings/Toasts';
import { useSettingsStore } from '../../stores/settings';
import { AppProvider } from '../../context/AppContext';
import * as auth from '@/lib/auth';

function renderWithProviders() {
  return render(
    <AppProvider>
      <ToastProvider>
        <Account />
      </ToastProvider>
    </AppProvider>
  );
}

describe('Account component', () => {
  beforeEach(() => {
    useSettingsStore.getState().update({ account: { session: 'disconnected' } });
    vi.mocked(auth.signInGoogle).mockResolvedValue();
    vi.mocked(auth.signOut).mockResolvedValue();
    vi.mocked(auth.getSession).mockResolvedValue(null);
  });

  it('renders Google button when logged out and calls signInGoogle', async () => {
    renderWithProviders();
    expect(document.querySelector('[aria-live="polite"]')).toBeInTheDocument();
    const btn = screen.getByText('Se connecter avec Google');
    fireEvent.click(btn);
    expect(auth.signInGoogle).toHaveBeenCalled();
  });

  it('shows logout when logged in', async () => {
    useSettingsStore.getState().update({ account: { session: 'connected', email: 'a@b.c' } });
    renderWithProviders();
    expect(screen.getByText('Se déconnecter')).toBeInTheDocument();
  });
});
