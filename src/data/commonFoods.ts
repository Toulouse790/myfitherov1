import { CommonFood } from "@/types/food";
import { proteinFoods } from "./foods/proteins";
import { carbFoods } from "./foods/carbs";
import { vegetableFoods } from "./foods/vegetables";
import { fruitFoods } from "./foods/fruits";
import { dairyFoods } from "./foods/dairy";
import { otherFoods } from "./foods/others";

export const commonFoods: CommonFood[] = [
  ...proteinFoods,
  ...carbFoods,
  ...vegetableFoods,
  ...fruitFoods,
  ...dairyFoods,
  ...otherFoods
];