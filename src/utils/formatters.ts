
export const formatAmount = (ingredient: string, quantity: number) => {
  if (ingredient === "زبادي") {
    return `${quantity.toFixed(2)} علبة`;
  } else if (quantity < 1) {
    return `${(quantity * 1000).toFixed(0)} جرام`;
  } else {
    return `${quantity.toFixed(3)} كيلو`;
  }
};
