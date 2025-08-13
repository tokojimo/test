import { describe, it, expect } from "vitest";

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (0 <= h && h < 60) {
    r = c;
    g = x;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
  } else if (120 <= h && h < 180) {
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    b = x;
  }
  return [r + m, g + m, b + m];
}

function luminance([r, g, b]: [number, number, number]) {
  const a = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrast(hsl1: [number, number, number], hsl2: [number, number, number]) {
  const L1 = luminance(hslToRgb(...hsl1));
  const L2 = luminance(hslToRgb(...hsl2));
  const [lighter, darker] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Latin name contrast", () => {
  it("muted foreground contrasts against card background", () => {
    const muted: [number, number, number] = [137, 15, 36.5]; // --moss-green
    const background: [number, number, number] = [37, 45, 92.2]; // --paper-beige
    expect(contrast(muted, background)).toBeGreaterThanOrEqual(4.5);
  });
});
