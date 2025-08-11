import tokens from './design-tokens.json';

export default tokens;

// Utility class tokens built on top of design tokens
export const BTN =
  "inline-flex items-center justify-center rounded-md px-4 py-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
export const BTN_GHOST_ICON =
  "text-foreground hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-accent rounded-md";
export const GLASS_CARD =
  "rounded-3xl bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl";
export const T_PRIMARY = "text-foreground";
export const T_MUTED = "text-foreground/70";
export const T_SUBTLE = "text-foreground/50";
