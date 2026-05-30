import React from "react";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect } from "vitest";

import MapScene, { getNextMushroomSelection } from "../MapScene";
import { AppProvider } from "@/context/AppContext";
import { reverseGeocode } from "../../services/openstreetmap";

// Hoist mocks for framer-motion
const { motionSection, motionButton } = vi.hoisted(() => ({
  motionSection: vi.fn((props: any) => <section {...props} />),
  motionButton: vi.fn((props: any) => <button {...props} />),
}));

vi.mock("framer-motion", () => ({
  motion: {
    section: motionSection,
    button: motionButton,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

let mapInstance: any;

// Mock OpenStreetMap services
vi.mock("../../services/openstreetmap", () => {
  class Map {
    handlers: Record<string, any> = {};
    constructor() {
      mapInstance = this;
    }
    on(event: string, cb: any) {
      this.handlers[event] = cb;
    }
    getCanvas() {
      return { style: {} } as any;
    }
    flyTo() {}
    remove() {}
    addSource() {}
    addLayer() {}
    getSource() {
      return null;
    }
    fitBounds() {}
  }
  class Marker {
    constructor() {}
    setLngLat() {
      return this;
    }
    addTo() {
      return this;
    }
    remove() {}
  }
  return {
    loadMap: vi.fn(() => Promise.resolve({ Map, Marker })),
    geocode: vi.fn(),
    reverseGeocode: vi.fn(() => Promise.resolve("Testville")),
    getStaticMapUrl: vi.fn(() => ""),
  };
});

describe("MapScene", () => {
  it("keeps GPS inactive until the user explicitly taps the GPS button", () => {
    const watchPosition = vi.fn();
    const setGpsFollow = vi.fn();

    Object.defineProperty(window, "isSecureContext", {
      configurable: true,
      value: true,
    });
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        watchPosition,
        clearWatch: vi.fn(),
      },
    });

    render(
      <AppProvider>
        <MapScene
          onZone={() => {}}
          gpsFollow={false}
          setGpsFollow={setGpsFollow}
          onBack={() => {}}
        />
      </AppProvider>,
    );

    expect(watchPosition).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "GPS" }));

    expect(setGpsFollow).toHaveBeenCalledWith(expect.any(Function));
    expect(watchPosition).not.toHaveBeenCalled();
  });

  it("explains that GPS needs HTTPS or localhost instead of starting a watcher in an insecure context", async () => {
    const watchPosition = vi.fn();
    const setGpsFollow = vi.fn();

    Object.defineProperty(window, "isSecureContext", {
      configurable: true,
      value: false,
    });
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        watchPosition,
        clearWatch: vi.fn(),
      },
    });

    render(
      <AppProvider>
        <MapScene
          onZone={() => {}}
          gpsFollow={true}
          setGpsFollow={setGpsFollow}
          onBack={() => {}}
        />
      </AppProvider>,
    );

    expect(
      await screen.findByRole("button", { name: /HTTPS ou sur localhost/ }),
    ).toBeInTheDocument();
    expect(watchPosition).not.toHaveBeenCalled();
    expect(setGpsFollow).toHaveBeenCalledWith(false);
  });

  it("keeps only the three most recently activated mushroom maps", () => {
    const selection = ["cepe_de_bordeaux", "girolle", "morille_commune"];

    expect(getNextMushroomSelection(selection, "morille_conique")).toEqual([
      "girolle",
      "morille_commune",
      "morille_conique",
    ]);
  });

  it("deactivates the first selected mushroom button when a fourth is activated", () => {
    render(
      <AppProvider>
        <MapScene
          onZone={() => {}}
          gpsFollow={false}
          setGpsFollow={() => {}}
          onBack={() => {}}
        />
      </AppProvider>,
    );

    const cepe = screen.getByRole("button", { name: "Cèpe de Bordeaux" });
    const girolle = screen.getByRole("button", {
      name: "Girolle (Chanterelle)",
    });
    const morille = screen.getByRole("button", { name: "Morille commune" });
    const morilleConique = screen.getByRole("button", {
      name: "Morille conique",
    });

    expect(cepe).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(girolle);
    fireEvent.click(morille);
    fireEvent.click(morilleConique);

    expect(cepe).toHaveAttribute("aria-pressed", "false");
    expect(girolle).toHaveAttribute("aria-pressed", "true");
    expect(morille).toHaveAttribute("aria-pressed", "true");
    expect(morilleConique).toHaveAttribute("aria-pressed", "true");
  });

  it("removes the third map notification before adding the next one", async () => {
    (reverseGeocode as any)
      .mockResolvedValueOnce("Zone 1")
      .mockResolvedValueOnce("Zone 2")
      .mockResolvedValueOnce("Zone 3")
      .mockResolvedValueOnce("Zone 4");

    render(
      <AppProvider>
        <MapScene
          onZone={() => {}}
          gpsFollow={false}
          setGpsFollow={() => {}}
          onBack={() => {}}
        />
      </AppProvider>,
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    for (const index of [1, 2, 3]) {
      await act(async () => {
        mapInstance.handlers.click({ lngLat: { lat: index, lng: index } });
        await Promise.resolve();
      });
    }

    expect(
      await screen.findByRole("button", { name: /Zone 3/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Zone 2/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Zone 1/ })).toBeInTheDocument();

    await act(async () => {
      mapInstance.handlers.click({ lngLat: { lat: 4, lng: 4 } });
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /Zone 1/ }),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", { name: /Zone 4/ }),
    ).not.toBeInTheDocument();

    await act(async () => {
      await new Promise((r) => setTimeout(r, 250));
    });

    expect(screen.getByRole("button", { name: /Zone 4/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Zone 3/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Zone 2/ })).toBeInTheDocument();
  });

  it("opens zone when toast is clicked", async () => {
    const onZone = vi.fn();
    render(
      <AppProvider>
        <MapScene
          onZone={onZone}
          gpsFollow={false}
          setGpsFollow={() => {}}
          onBack={() => {}}
        />
      </AppProvider>,
    );

    // Wait for map to initialize then simulate a click near a known zone
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
      mapInstance.handlers.click({ lngLat: { lat: 45.7, lng: 5.9 } });
      await Promise.resolve();
    });

    const toast = await screen.findByRole("button", { name: /Testville/ });
    fireEvent.click(toast);

    expect(onZone).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Testville", coords: [45.7, 5.9] }),
    );
  });

  it("shows water message when place has no name", async () => {
    (reverseGeocode as any).mockResolvedValueOnce(null);
    render(
      <AppProvider>
        <MapScene
          onZone={() => {}}
          gpsFollow={false}
          setGpsFollow={() => {}}
          onBack={() => {}}
        />
      </AppProvider>,
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
      mapInstance.handlers.click({ lngLat: { lat: 0, lng: 0 } });
      await Promise.resolve();
    });

    const toast = await screen.findByRole("button", {
      name: /Pas de champignons ici/,
    });
    expect(toast).toBeInTheDocument();
  });
});
