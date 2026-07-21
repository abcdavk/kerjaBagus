export function formatCompactRupiah(value: number): string {
  if (value >= 1_000_000_000) {
    const result = value / 1_000_000_000;
    return `Rp${Number.isInteger(result) ? result : result.toFixed(1)}M`;
  }

  if (value >= 1_000_000) {
    const result = value / 1_000_000;
    return `Rp${Number.isInteger(result) ? result : result.toFixed(1)}jt`;
  }

  if (value >= 1_000) {
    const result = value / 1_000;
    return `Rp${Number.isInteger(result) ? result : result.toFixed(0)}rb`;
  }

  return `Rp${value}`;
}