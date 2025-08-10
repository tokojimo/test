import React from "react";
import { useAppContext } from "../context/AppContext";

export default function DaySlider() {
  const { state, dispatch } = useAppContext();
  return (
    <div className="p-3">
      <input
        type="range"
        min={-7}
        max={7}
        value={state.day}
        onChange={(e) => dispatch({ type: "setDay", day: parseInt(e.target.value, 10) })}
        className="w-full"
      />
      <div className="text-center text-xs mt-1">J{state.day >= 0 ? "+" : ""}{state.day}</div>
    </div>
  );
}
