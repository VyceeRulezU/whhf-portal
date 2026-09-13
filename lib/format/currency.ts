/**
 * Money is stored/passed internally as an integer in the smallest currency
 * unit (kobo, cents). Convert to a display string only here, at the edge —
 * never do float math on money elsewhere in the app. See code-style.md.
 */
export function formatCurrency(amountSmallestUnit: number, currency: string): string {
  const major = amountSmallestUnit / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: major % 1 === 0 ? 0 : 2
  }).format(major);
}
