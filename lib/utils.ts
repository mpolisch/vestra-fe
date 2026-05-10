const cadCurrencyFormatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
});

export const formatCurrency = (val: number) =>
    cadCurrencyFormatter.format(val);
