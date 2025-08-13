import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import "@/index.css";

import MushroomsIndex from "../index";
import { AppProvider } from "@/context/AppContext";
import type { Mushroom } from "@/types";

const mushrooms: Mushroom[] = [
  {
    id: "cepe",
    name: "Cèpe",
    latin: "Boletus",
    edible: true,
    category: "cèpe",
    premium: false,
    popularity: 10,
    season: "",
    habitat: "",
    weatherIdeal: "",
    description: "",
    culinary: "",
    cookingTips: "",
    dishes: [],
    confusions: [],
    picking: "",
    photo: "",
  },
  {
    id: "morille",
    name: "Morille",
    latin: "Morchella",
    edible: true,
    category: "morille",
    premium: true,
    popularity: 50,
    season: "",
    habitat: "",
    weatherIdeal: "",
    description: "",
    culinary: "",
    cookingTips: "",
    dishes: [],
    confusions: [],
    picking: "",
    photo: "",
  },
];

const { loadMock } = vi.hoisted(() => ({ loadMock: vi.fn() }));
vi.mock("@/services/dataLoader", () => ({
  loadMushrooms: loadMock,
}));

describe("MushroomsIndex", () => {
  beforeEach(() => {
    loadMock.mockResolvedValue(mushrooms);
  });

  it("searches, filters and sorts", async () => {
    render(
      <AppProvider>
        <MushroomsIndex />
      </AppProvider>
    );
    await waitFor(() => screen.getAllByText("Cèpe"));
    const search = screen.getByPlaceholderText("Rechercher") as HTMLInputElement;
    fireEvent.change(search, { target: { value: "moril" } });
    await new Promise(r => setTimeout(r,0));
    expect(screen.getAllByText("Morille").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Cèpe").length).toBe(0);

    fireEvent.change(search, { target: { value: "" } });
    fireEvent.change(screen.getByDisplayValue("Tous accès"), { target: { value: "premium" } });
    await new Promise(r => setTimeout(r,0));
    expect(screen.getAllByText("Morille").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Cèpe").length).toBe(0);

    fireEvent.change(screen.getByDisplayValue("Alphabétique"), { target: { value: "popular" } });
    const cards = screen.getAllByRole("heading", { level: 3 });
    expect(cards[0]).toHaveTextContent("Morille");
  });

  it("card is focusable and activable via keyboard", async () => {
    render(
      <AppProvider>
        <MushroomsIndex />
      </AppProvider>
    );
    await waitFor(() => screen.getByRole("link", { name: /Cèpe/ }));
    const card = screen.getByRole("link", { name: /Cèpe/ });
    card.focus();
    expect(card).toHaveFocus();
    expect(card.className).toContain("focus-visible:ring-[var(--focus)]");
    fireEvent.keyDown(card, { key: "Enter" });
    await waitFor(() => screen.getByRole("dialog"));
  });

  it("activates card with Space key", async () => {
    render(
      <AppProvider>
        <MushroomsIndex />
      </AppProvider>
    );
    await waitFor(() => screen.getByRole("link", { name: /Cèpe/ }));
    const card = screen.getByRole("link", { name: /Cèpe/ });
    card.focus();
    fireEvent.keyDown(card, { key: " " });
    await waitFor(() => screen.getByRole("dialog"));
  });

  it("renders responsive columns", async () => {
    render(
      <AppProvider>
        <MushroomsIndex />
      </AppProvider>
    );
    await waitFor(() => screen.getByTestId("mushrooms-grid"));
    const grid = screen.getByTestId("mushrooms-grid");
    const classes = grid.className;
    expect(classes).toContain("grid");
    expect(classes).toContain("gap-6");
    expect(classes).toContain("grid-cols-1");
    expect(classes).toContain("sm:grid-cols-2");
    expect(classes).toContain("lg:grid-cols-3");
    expect(classes).toContain("xl:grid-cols-4");
  });

  it("shows loading and empty states", async () => {
    const { container } = render(
      <AppProvider>
        <MushroomsIndex />
      </AppProvider>
    );
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
    await waitFor(() => screen.getByRole("link", { name: /Cèpe/ }));
    fireEvent.change(screen.getByPlaceholderText("Rechercher"), { target: { value: "xyz" } });
    await waitFor(() => screen.getByText("Effacer filtres"));
    expect(screen.getByText("Aucun résultat")).toBeInTheDocument();
  });
});
