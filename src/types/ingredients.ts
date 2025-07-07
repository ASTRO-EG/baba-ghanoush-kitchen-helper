
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
  "حمص": 1.000,
  "ثوم": 0.075,
  "زبادي": 4.000,
  "عصير ليمون": 0.280,
  "بيروكلينيت": 0.300,
  "ملح": 0.140,
  "كمون": 0.075
};
