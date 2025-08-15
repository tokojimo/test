import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import History from "./History";
import { AppProvider } from "@/context/AppContext";
import { MemoryRouter } from "react-router-dom";

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
        }
      }))
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
        Tooltip: Mock
      };
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders base layout", () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <History />
        </AppProvider>
      </MemoryRouter>
    );
    expect(screen.getByText("Mon coin")).toBeInTheDocument();
    expect(screen.getByText("Ajouter une cueillette")).toBeInTheDocument();
    expect(screen.getByText("Itinéraire")).toBeInTheDocument();
  });

  it("opens and closes modal", () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <History />
        </AppProvider>
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Ajouter une cueillette"));
    expect(screen.getByRole("heading", { name: "Ajouter une cueillette" })).toBeInTheDocument();
    fireEvent.click(screen.getByText("Annuler"));
    expect(screen.queryByRole("heading", { name: "Ajouter une cueillette" })).not.toBeInTheDocument();
  });
});

