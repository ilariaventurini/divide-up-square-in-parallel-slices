/**
 * Return a random hex color.
 */
export function randomColor(): string {
  return `#${((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0')}`
}
