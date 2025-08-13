import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import ChartSkeleton from "./ChartSkeleton";
import { Timeline, TimelineEvent } from "./Timeline";
import TimelineSkeleton from "./TimelineSkeleton";

const tabs = [
  { id: "history", label: "Historique" },
  { id: "forecast", label: "Prévisions locales" },
  { id: "visits", label: "Visites" },
];

function formatDate(str: string) {
  const d = new Date(str);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

export function InsightsCard({ events, onSelect }: { events: TimelineEvent[]; onSelect: (id: string) => void }) {
  const [active, setActive] = useState("history");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ date: string; value: number }[]>([]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const now = new Date();
      const d = Array.from({ length: 10 }).map((_, i) => ({
        date: new Date(now.getTime() - (9 - i) * 86400000).toISOString().slice(0, 10),
        value: (i * 10) % 100,
      }));
      setData(d);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [active]);

  const ticks = data.length
    ? data
        .filter((_, i) => i % Math.ceil(data.length / 6) === 0)
        .map(d => d.date)
    : [];

  return (
    <Card className="p-4 lg:p-6 flex flex-col">
      <CardHeader className="p-0 mb-4 border-none">
        <CardTitle>Insights</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <Tabs tabs={tabs} active={active} onChange={setActive} />
        <div className="mt-4" style={{ height: 240 }}>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="date" ticks={ticks} tickFormatter={formatDate} stroke="hsl(var(--foreground))" tick={{ fill: "hsl(var(--foreground))" }} />
                <YAxis domain={[0, 100]} stroke="hsl(var(--foreground))" tick={{ fill: "hsl(var(--foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 4 }} labelFormatter={(v) => formatDate(v as string)} />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--forest-green))" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-4 flex-1 overflow-auto">
          {loading ? <TimelineSkeleton /> : <Timeline events={events} onSelect={onSelect} />}
        </div>
      </CardContent>
    </Card>
  );
}

export default InsightsCard;
