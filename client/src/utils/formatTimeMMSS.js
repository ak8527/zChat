export default function formatTimeMMSS(time) {
  if (!time || isNaN(time)) return '00:00';
  const minutes = Math.floor(time / 60);
  const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const seconds = Math.floor(time % 60);
  const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${formatMinutes}:${formatSeconds}`;
}
