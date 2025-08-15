import React, { useMemo, useEffect, useRef } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { animate } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { generateForecast } from "@/utils";

export function ForecastChart({ className = "" }: { className?: string }) {
  const { state } = useAppContext();
  const data = useMemo(() => generateForecast(state.prefs.lang), [state.prefs.lang]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = chartRef.current?.querySelector(".recharts-line-curve") as SVGPathElement | null;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    animate(path, { strokeDashoffset: 0 }, { duration: 1.2, ease: "easeInOut" });
  }, [data]);

  return (
    <div ref={chartRef} className={`h-56 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--forest-green))" }} interval={3} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--forest-green))" }} width={28} />
          <Tooltip
            contentStyle={{
              background: "#171717",
              border: "1px solid #262626",
              borderRadius: 12,
              color: "#e5e5e5",
            }}
          />
          <ReferenceLine x={data[7].day} stroke="#525252" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--fern-green))"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ForecastChart;
