const COMPANY_PREFIXES = new Set([
  "PT",
  "CV",
  "UD",
  "PD",
  "TBK",
  "PERSERO",
  "PERSEROAN",
  "INC",
  "LLC",
  "LTD",
  "LIMITED",
  "CORP",
  "CORPORATION",
  "CO",
  "COMPANY",
  "GMBH",
  "BV",
  "NV",
  "PLC",
  "SAS",
  "SRL",
  "SPA",
  "AG",
]);

export function getCompanyInitials(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/[.,]/g, ""))
    .filter(Boolean)
    .filter((word) => !COMPANY_PREFIXES.has(word.toUpperCase()));

  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}