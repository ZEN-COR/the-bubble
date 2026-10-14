const aucklandFormatter = new Intl.DateTimeFormat("en-NZ", {
  timeZone: "Pacific/Auckland",
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
});

export function formatAucklandDateTime(value: Date): string {
  return aucklandFormatter.format(value);
}
