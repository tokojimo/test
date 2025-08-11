import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import LandingScene from '../LandingScene';
import { AppProvider } from '@/context/AppContext';

const { motionDiv, motionSection } = vi.hoisted(() => {
  return {
    motionDiv: vi.fn((props: any) => <div {...props} />),
    motionSection: vi.fn((props: any) => <section {...props} />),
  };
});

vi.mock('framer-motion', () => ({
  motion: {
    div: motionDiv,
    section: motionSection,
  },
}));

function renderScene() {
  render(
    <AppProvider>
      <LandingScene
        onSeeMap={() => {}}
        onMySpots={() => {}}
        onOpenSettings={() => {}}
        onOpenPicker={() => {}}
      />
    </AppProvider>
  );
}

describe('LandingScene', () => {
  beforeEach(() => {
    motionDiv.mockClear();
    motionSection.mockClear();
  });

  it('renders rotating background orbs', () => {
    renderScene();
    const calls = motionDiv.mock.calls;
    const primary = calls.find(([props]) => props.className?.includes('bg-forest/30'));
    const secondary = calls.find(([props]) => props.className?.includes('bg-moss/20'));
    expect(primary).toBeTruthy();
    expect(primary![0].animate).toMatchObject({ rotate: expect.any(Array) });
    expect(secondary).toBeTruthy();
    expect(secondary![0].animate).toMatchObject({ rotate: expect.any(Array) });
  });

  it('shows glassmorphic card with animated content', () => {
    renderScene();
    const card = motionDiv.mock.calls.find(([props]) => props.className?.includes('backdrop-blur-xl'));
    expect(card).toBeTruthy();
    expect(card![0].initial).toEqual({ y: 20, opacity: 0 });
    expect(card![0].animate).toEqual({ y: 0, opacity: 1 });
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
