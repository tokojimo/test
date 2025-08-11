export type AlertSettings = {
  optimum: boolean;
  newZone: boolean;
};

export async function saveAlerts(alerts: AlertSettings): Promise<AlertSettings> {
  await new Promise((r) => setTimeout(r, 200));
  return alerts;
}
