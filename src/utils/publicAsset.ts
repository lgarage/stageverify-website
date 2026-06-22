/** Resolve a public/ asset path with the site base URL (GitHub Pages safe). */
export function publicAsset(path: string): string {
  const base = import.meta.env.BASE_URL;
  const normalized = path.replace(/^\//, "");
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}${normalized}`;
}
