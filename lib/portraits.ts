export function portraitUrl(file: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}/portraits/${file}`;
}
