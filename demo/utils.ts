/**
 * Return an array of 'amount' numbers whose sum is exactly 'sum'.
 * @param amount number of items
 * @param sum sum value
 */
export function randomWithFixedSum(amount: number, sum: number): number[] {
  const numbers = Array(amount).fill(0).map(Math.random)
  const randomSum = numbers.reduce((a, b) => a + b, 0)
  const generated = numbers.map((n) => (n * sum) / randomSum)
  // Sometimes the percentages sum is !== 1. This is due to JS floating point error.
  // In these case generate the numbers again
  const diff = generated.reduce((a, g) => a + g, 0) - sum
  return diff ? randomWithFixedSum(amount, sum) : generated
}

/**
 * Return a random hex color.
 */
export function randomColor(): string {
  return `#${((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0')}`
}

/**
 * Return a random number in range.
 */
export function randomIntegerInRange(range: [number, number]): number {
  const [min, max] = range
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Return value rounded using two decimals.
 * @param value value to round
 */
export function roundToTwoDecimals(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}
