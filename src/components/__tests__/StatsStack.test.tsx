import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StatsStack } from "../StatsStack";

beforeAll(() => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  // @ts-ignore
  global.ResizeObserver = ResizeObserver;
});

describe("StatsStack", () => {
  it("stacks at most three cards", async () => {
    render(<StatsStack />);
    const button = screen.getByRole("button", { name: /ajouter une carte/i });
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    await waitFor(() => expect(screen.getAllByTestId("stat-card")).toHaveLength(3));
  });

  it("opens dashboard on card click", async () => {
    render(<StatsStack />);
    const button = screen.getByRole("button", { name: /ajouter une carte/i });
    fireEvent.click(button);
    const card = await screen.findByTestId("stat-card");
    fireEvent.click(card);
    await waitFor(() => expect(screen.getByText("Comestibles probables")).toBeInTheDocument());
  });
});
