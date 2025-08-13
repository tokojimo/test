import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import History from "./History";
import { AppProvider } from "@/context/AppContext";

function setScreenWidth(width: number) {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: width });
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes("max-width") ? width <= 1023 : width >= 1024,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe("History page", () => {
  beforeEach(() => {
    vi.mock("@/services/openstreetmap", () => ({
      loadMap: vi.fn(async () => ({
        Map: class {
          remove() {}
        },
        Marker: class {
          setLngLat() {
            return this;
          }
          addTo() {
            return this;
          }
        },
      })),
    }));
    vi.mock("recharts", () => {
      const React = require("react");
      const Mock = ({ children }: any) => <div>{children}</div>;
      return {
        ResponsiveContainer: Mock,
        LineChart: Mock,
        Line: Mock,
        XAxis: Mock,
        YAxis: Mock,
        CartesianGrid: Mock,
        Tooltip: Mock,
      };
    });
  });

  it("renders bottom CTA on mobile", () => {
    setScreenWidth(500);
    render(
      <AppProvider>
        <History />
      </AppProvider>
    );
    expect(screen.getAllByText("Ajouter une cueillette").length).toBe(2);
  });

  it("hides bottom CTA on desktop", () => {
    setScreenWidth(1200);
    render(
      <AppProvider>
        <History />
      </AppProvider>
    );
    expect(screen.getAllByText("Ajouter une cueillette").length).toBe(1);
  });

  it("opens and closes modal", () => {
    setScreenWidth(1200);
    render(
      <AppProvider>
        <History />
      </AppProvider>
    );
    fireEvent.click(screen.getByText("Ajouter une cueillette"));
    expect(screen.getByText("Modifier la cueillette")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByText("Modifier la cueillette")).not.toBeInTheDocument();
  });

  it("validates form fields", () => {
    setScreenWidth(1200);
    render(
      <AppProvider>
        <History />
      </AppProvider>
    );
    fireEvent.click(screen.getByText("Ajouter une cueillette"));
    const save = screen.getByText("Enregistrer");
    fireEvent.click(save);
    expect(screen.getByText("Requis")).toBeInTheDocument();
  });

  it("opens modal via keyboard on timeline", async () => {
    setScreenWidth(1200);
    render(
      <AppProvider>
        <History />
      </AppProvider>
    );
    const rowText = await screen.findByText("01/09/2024");
    const row = rowText.closest("button") as HTMLButtonElement;
    row.focus();
    fireEvent.keyDown(row, { key: "Enter", code: "Enter", charCode: 13 });
    fireEvent.click(row);
    expect(screen.getByText("Modifier la cueillette")).toBeInTheDocument();
  });
});
