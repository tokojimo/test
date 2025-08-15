export function classNames(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function generateForecast(lang: string) {
  const days = [] as { day: string; score: number }[];
  const today = new Date();
  for (let i = -7; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      day: d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { day: "2-digit", month: "2-digit" }),
      score: Math.max(
        10,
        Math.min(100, Math.round(60 + 25 * Math.sin(i / 2) + (Math.random() * 10 - 5)))
      )
    });
  }
  return days;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(str: string) {
  const d = new Date(str);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
