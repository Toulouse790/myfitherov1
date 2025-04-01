
import { useState } from "react";
import { CommonFood } from "@/types/food";

export const useFoodInput = () => {
  const [newFood, setNewFood] = useState("");
  const [calories, setCalories] = useState(0);
  const [proteins, setProteins] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);
  const [weight, setWeight] = useState(100);
  const [notes, setNotes] = useState("");
  const [baseCalories, setBaseCalories] = useState(100);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredFoods, setFilteredFoods] = useState<CommonFood[]>([]);
  
  return {
    newFood,
    calories,
    proteins,
    carbs,
    fats,
    weight,
    notes,
    baseCalories,
    selectedCategory,
    filteredFoods,
    setNewFood,
    setCalories,
    setProteins,
    setCarbs,
    setFats,
    setWeight,
    setNotes,
    setBaseCalories,
    setSelectedCategory,
    setFilteredFoods
  };
};
