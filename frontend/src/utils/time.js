export function DurationToString(duration) {
  const seconds = duration / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const years = days / 365;

  if (Math.round(years) >= 1) return `${Math.round(years)}y`;
  if (Math.round(days) >= 1) return `${Math.round(days)}d`;
  if (Math.round(hours) >= 1) return `${Math.round(hours)}h`;
  if (Math.round(minutes) >= 1) return `${Math.round(minutes)}m`;
  return `${Math.round(seconds)}s`;
}
