import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";

import MushroomsIndex from "../index";
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
    render(<MushroomsIndex />);
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

  it("allows keyboard navigation", async () => {
    render(<MushroomsIndex />);
    await waitFor(() => screen.getByPlaceholderText("Rechercher"));
    const search = screen.getByPlaceholderText("Rechercher");
    (search as HTMLElement).focus();
    expect(search).toHaveFocus();
    const select = screen.getByDisplayValue("Toutes catégories");
    (select as HTMLElement).focus();
    expect(select).toHaveFocus();
  });

  it("shows loading and empty states", async () => {
    const { container } = render(<MushroomsIndex />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
    await new Promise((r) => setTimeout(r, 0));
    expect(screen.getAllByText("Cèpe")[0]).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText("Rechercher"), { target: { value: "xyz" } });
    await new Promise(r => setTimeout(r,0));
    expect(screen.getByText("Aucun champignon.")).toBeInTheDocument();
  });
});

