export function formatVNDCompact(amount: number) {
  if (amount >= 1_000_000_000) {
    return (amount / 1_000_000_000)
      .toFixed(amount % 1_000_000_000 === 0 ? 0 : 1)
      .replace('.', ',') + " tỷ";
  }

  if (amount >= 1_000_000) {
    return (amount / 1_000_000)
      .toFixed(amount % 1_000_000 === 0 ? 0 : 1)
      .replace('.', ',') + " triệu";
  }

  if (amount >= 1_000) {
    return (amount / 1_000)
      .toFixed(amount % 1_000 === 0 ? 0 : 1)
      .replace('.', ',') + " nghìn";
  }

  return amount.toLocaleString("vi-VN") + " ₫";
}
