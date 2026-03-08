export const formatCurrency = (amount: number | string, currency = "Rs") => {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;
  return `${currency} ${safeAmount.toFixed(2)}`;
};

export const parseCurrency = (amount: string) => {
  const parsed = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

