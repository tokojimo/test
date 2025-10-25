import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Toaster } from '../Toaster';
import { toast, useToastStore } from '../toast';

const { useReducedMotionMock } = vi.hoisted(() => ({
  useReducedMotionMock: vi.fn(() => false),
}));

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: { div: (props: any) => <div {...props} /> },
  useReducedMotion: useReducedMotionMock,
}));

describe('toast system', () => {
  beforeEach(() => {
    useToastStore.getState().dismiss();
    useReducedMotionMock.mockReturnValue(false);
  });

  it('respects order and max stack', async () => {
    render(<Toaster />);
    act(() => {
      toast.show({ message: 'A' });
      toast.show({ message: 'B' });
      toast.show({ message: 'C' });
      toast.show({ message: 'D' });
    });
    await waitFor(() => {
      const items = screen.getAllByRole('status');
      expect(items).toHaveLength(3);
      expect(items[0]).toHaveTextContent('D');
      expect(items[2]).toHaveTextContent('B');
    });
  });

  it('auto dismisses with pause on hover', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => { toast.show({ message: 'Hello', duration: 1000 }); });
    const item = screen.getByText('Hello');
    act(() => { vi.advanceTimersByTime(900); });
    expect(item).toBeInTheDocument();
    fireEvent.mouseEnter(item.parentElement!);
    act(() => { vi.advanceTimersByTime(2000); });
    expect(item).toBeInTheDocument();
    fireEvent.mouseLeave(item.parentElement!);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.queryByText('Hello')).toBeNull();
    vi.useRealTimers();
  });

  it('reorders when a toast disappears', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => {
      toast.show({ message: 'A', duration: 3000 });
      toast.show({ message: 'B', duration: 1000 });
    });
    let items = screen.getAllByRole('status');
    expect(items[0]).toHaveTextContent('B');
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    items = screen.getAllByRole('status');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('A');
    vi.useRealTimers();
  });

  it('honors prefers-reduced-motion', () => {
    useReducedMotionMock.mockReturnValue(true);
    render(<Toaster />);
    act(() => { toast.show({ message: 'Reduced' }); });
    const el = screen.getByText('Reduced').parentElement!;
    expect(el.getAttribute('data-reduced')).toBe('true');
  });

  it('focuses action and closes on Escape', () => {
    const onAction = vi.fn();
    render(<Toaster />);
    act(() => { toast.show({ message: 'Act', action: { label: 'Do', onClick: onAction } }); });
    const action = screen.getByRole('button', { name: 'Do' });
    expect(action).toHaveFocus();
    fireEvent.keyDown(action, { key: 'Escape' });
    expect(screen.queryByText('Act')).toBeNull();
  });

  it('uses assertive live region for error toasts', () => {
    render(<Toaster />);
    const region = screen.getByRole('region');
    expect(region).toHaveAttribute('aria-live', 'polite');
    act(() => {
      toast.show({ message: 'Oops', variant: 'error', duration: 1000 });
    });
    expect(region).toHaveAttribute('aria-live', 'assertive');
  });
});
