import React, { createContext, useContext, useReducer } from "react";
import type { Spot } from "../types";

type Prefs = { units: string; theme: string; gps: boolean };
type Alerts = { optimum: boolean; newZone: boolean };

interface AppState {
  prefs: Prefs;
  alerts: Alerts;
  mySpots: Spot[];
  day: number;
}

type Action =
  | { type: "setPrefs"; prefs: Partial<Prefs> }
  | { type: "setAlerts"; alerts: Partial<Alerts> }
  | { type: "addSpot"; spot: Spot }
  | { type: "updateSpot"; spot: Spot }
  | { type: "setDay"; day: number };

const initialState: AppState = {
  prefs: { units: "métriques", theme: "auto", gps: true },
  alerts: { optimum: true, newZone: false },
  mySpots: [],
  day: 0,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "setPrefs":
      return { ...state, prefs: { ...state.prefs, ...action.prefs } };
    case "setAlerts":
      return { ...state, alerts: { ...state.alerts, ...action.alerts } };
    case "addSpot":
      return { ...state, mySpots: [action.spot, ...state.mySpots] };
    case "updateSpot":
      return {
        ...state,
        mySpots: state.mySpots.map((s) => (s.id === action.spot.id ? action.spot : s)),
      };
    case "setDay":
      return { ...state, day: action.day };
    default:
      return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | undefined>(
  undefined
);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return ctx;
}

