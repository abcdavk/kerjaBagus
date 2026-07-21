import { formatCompactRupiah } from "./currency";

export function formatSalaryRange(
  min?: number | null,
  max?: number | null
): string {
  if (min == null && max == null) {
    return "Negosiasi";
  }

  if (min != null && max == null) {
    return `${formatCompactRupiah(min)}+`;
  }

  if (min == null && max != null) {
    return `≤ ${formatCompactRupiah(max)}`;
  }

  return `${formatCompactRupiah(min!)}-${formatCompactRupiah(max!)}`;
}