
export interface Ingredients {
  [key: string]: number;
}

export interface SavedRecord {
  id: string;
  date: string;
  amount: number;
  totalAmounts: Ingredients;
  perPotAmounts: Ingredients;
}

export const defaultIngredients: Ingredients = {
  "طحينة": 1.900,
  "ثوم": 0.075,
  "زبادي": 2.000,
  "عصير ليمون": 0.280,
  "ليمون قبل العصر": 0.700,
  "ملح": 0.140,
  "كمون": 0.075
};
