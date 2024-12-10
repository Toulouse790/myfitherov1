export const NUTRITIONAL_RANGES = {
  proteins: { min: 0, max: 100, warning: 50 }, // g
  carbs: { min: 0, max: 100, warning: 75 }, // g
  fats: { min: 0, max: 100, warning: 40 }, // g
  calories: { min: 0, max: 900, warning: 500 }, // kcal
} as const;

export const isValueSuspicious = (value: number, type: keyof typeof NUTRITIONAL_RANGES) => {
  const range = NUTRITIONAL_RANGES[type];
  return value < range.min || value > range.warning;
};