export default function fileSize(size) {
  if (size < 1024) return `${size} bytes`;
  else if (size < 1024 * 1024) return `${Math.floor(size / 1024)} KB`;
  else return `${Math.floor(size / (1024 * 1024))} MB`;
}
