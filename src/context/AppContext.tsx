import React, { createContext, useReducer, useContext, Dispatch, ReactNode } from 'react';

export type Prefs = {
  units: string;
  theme: string;
  gps: boolean;
};

export type Alerts = {
  optimum: boolean;
  newZone: boolean;
};

export interface AppState {
  prefs: Prefs;
  alerts: Alerts;
  mySpots: any[];
}

const initialState: AppState = {
  prefs: { units: 'métriques', theme: 'auto', gps: true },
  alerts: { optimum: true, newZone: false },
  mySpots: [],
};

export type Action =
  | { type: 'SET_PREFS'; prefs: Partial<Prefs> }
  | { type: 'SET_ALERTS'; alerts: Partial<Alerts> }
  | { type: 'ADD_SPOT'; spot: any }
  | { type: 'UPDATE_SPOT'; spot: any };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PREFS':
      return { ...state, prefs: { ...state.prefs, ...action.prefs } };
    case 'SET_ALERTS':
      return { ...state, alerts: { ...state.alerts, ...action.alerts } };
    case 'ADD_SPOT':
      return { ...state, mySpots: [action.spot, ...state.mySpots] };
    case 'UPDATE_SPOT':
      return {
        ...state,
        mySpots: state.mySpots.map((s) => (s.id === action.spot.id ? action.spot : s)),
      };
    default:
      return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: Dispatch<Action> } | undefined>(
  undefined
);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return ctx;
}

