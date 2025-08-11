import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Account from './Account';
import { ToastProvider } from '../../components/settings/Toasts';
import { useSettingsStore } from '../../stores/settings';
import { AppProvider } from '../../context/AppContext';

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
  it('logs in user', async () => {
    useSettingsStore.getState().update({ account: { session: 'disconnected' } });
    renderWithProviders();
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), {
      target: { value: 'abcd' },
    });
    fireEvent.click(screen.getByText('Se connecter'));
    await waitFor(() =>
      expect(useSettingsStore.getState().account.session).toBe('connected')
    );
  });
});
