export function DurationToString(duration) {
  const seconds = duration / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const years = days / 365;

  if (Math.round(years) >= 1) return `${years}`
}
