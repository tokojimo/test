import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StatsStack } from "../StatsStack";

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
});
