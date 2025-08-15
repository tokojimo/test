export function formatDate(str: string): string {
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return str;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
