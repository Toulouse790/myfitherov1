interface CommonFood {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  category: "Protéines" | "Féculents" | "Légumes" | "Fruits" | "Produits laitiers" | "Autres";
}

export const commonFoods: CommonFood[] = [
  {
    id: "1",
    name: "Poulet (100g)",
    calories: 165,
    proteins: 31,
    category: "Protéines"
  },
  {
    id: "2",
    name: "Riz blanc cuit (100g)",
    calories: 130,
    proteins: 2.7,
    category: "Féculents"
  },
  {
    id: "3",
    name: "Oeuf",
    calories: 70,
    proteins: 6,
    category: "Protéines"
  },
  {
    id: "4",
    name: "Pomme",
    calories: 52,
    proteins: 0.3,
    category: "Fruits"
  },
  {
    id: "5",
    name: "Yaourt nature (100g)",
    calories: 59,
    proteins: 3.6,
    category: "Produits laitiers"
  },
  {
    id: "6",
    name: "Thon en conserve (100g)",
    calories: 132,
    proteins: 26,
    category: "Protéines"
  },
  {
    id: "7",
    name: "Pâtes cuites (100g)",
    calories: 158,
    proteins: 5.8,
    category: "Féculents"
  },
  {
    id: "8",
    name: "Brocoli (100g)",
    calories: 34,
    proteins: 2.8,
    category: "Légumes"
  },
  {
    id: "9",
    name: "Banane",
    calories: 89,
    proteins: 1.1,
    category: "Fruits"
  },
  {
    id: "10",
    name: "Fromage blanc 0% (100g)",
    calories: 43,
    proteins: 8,
    category: "Produits laitiers"
  }
];