export interface CurrencyFormatOptions {
  currency?: string;
  symbol?: string;
  showDecimals?: boolean;
}

export function formatCurrency(
  amount: number | null | undefined,
  options: CurrencyFormatOptions = {}
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '৳0';
  }

  const { symbol = '৳', showDecimals = false } = options;

  const formattedNumber = new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  return `${symbol}${formattedNumber}`;
}

export function calculateProfitMargin(
  sellingPrice: number,
  costPrice: number | null | undefined
): number {
  if (!costPrice || sellingPrice <= 0 || costPrice <= 0) {
    return 0;
  }
  const profit = sellingPrice - costPrice;
  return Math.round((profit / sellingPrice) * 100);
}
