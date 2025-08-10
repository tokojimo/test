export function classNames(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function generateForecast() {
  const days = [] as { day: string; score: number }[];
  const today = new Date();
  for (let i = -7; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      day: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
      score: Math.max(10, Math.min(100, Math.round(60 + 25 * Math.sin(i / 2) + (Math.random() * 10 - 5))))
    });
  }
  return days;
}
