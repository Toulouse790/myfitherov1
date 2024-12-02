interface CommonFood {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  category: "Protéines" | "Féculents" | "Légumes" | "Fruits" | "Produits laitiers" | "Autres";
}

export const commonFoods: CommonFood[] = [
  // Protéines
  {
    id: "1",
    name: "Poulet (100g)",
    calories: 165,
    proteins: 31,
    category: "Protéines"
  },
  {
    id: "2",
    name: "Boeuf haché 5% (100g)",
    calories: 136,
    proteins: 21,
    category: "Protéines"
  },
  {
    id: "3",
    name: "Saumon (100g)",
    calories: 208,
    proteins: 22,
    category: "Protéines"
  },
  {
    id: "4",
    name: "Thon en conserve (100g)",
    calories: 132,
    proteins: 26,
    category: "Protéines"
  },
  {
    id: "5",
    name: "Oeufs (1 unité)",
    calories: 70,
    proteins: 6,
    category: "Protéines"
  },
  {
    id: "6",
    name: "Blanc d'oeuf (1 unité)",
    calories: 17,
    proteins: 3.6,
    category: "Protéines"
  },
  {
    id: "7",
    name: "Tofu (100g)",
    calories: 76,
    proteins: 8,
    category: "Protéines"
  },
  {
    id: "8",
    name: "Lentilles cuites (100g)",
    calories: 116,
    proteins: 9,
    category: "Protéines"
  },

  // Féculents
  {
    id: "9",
    name: "Riz blanc cuit (100g)",
    calories: 130,
    proteins: 2.7,
    category: "Féculents"
  },
  {
    id: "10",
    name: "Riz complet cuit (100g)",
    calories: 111,
    proteins: 2.6,
    category: "Féculents"
  },
  {
    id: "11",
    name: "Pâtes cuites (100g)",
    calories: 158,
    proteins: 5.8,
    category: "Féculents"
  },
  {
    id: "12",
    name: "Pomme de terre (100g)",
    calories: 77,
    proteins: 2,
    category: "Féculents"
  },
  {
    id: "13",
    name: "Patate douce (100g)",
    calories: 86,
    proteins: 1.6,
    category: "Féculents"
  },
  {
    id: "14",
    name: "Quinoa cuit (100g)",
    calories: 120,
    proteins: 4.4,
    category: "Féculents"
  },

  // Légumes
  {
    id: "15",
    name: "Brocoli (100g)",
    calories: 34,
    proteins: 2.8,
    category: "Légumes"
  },
  {
    id: "16",
    name: "Épinards (100g)",
    calories: 23,
    proteins: 2.9,
    category: "Légumes"
  },
  {
    id: "17",
    name: "Carottes (100g)",
    calories: 41,
    proteins: 0.9,
    category: "Légumes"
  },
  {
    id: "18",
    name: "Courgettes (100g)",
    calories: 17,
    proteins: 1.2,
    category: "Légumes"
  },
  {
    id: "19",
    name: "Haricots verts (100g)",
    calories: 31,
    proteins: 1.8,
    category: "Légumes"
  },
  {
    id: "20",
    name: "Poivron (100g)",
    calories: 20,
    proteins: 0.9,
    category: "Légumes"
  },

  // Fruits
  {
    id: "21",
    name: "Pomme (1 moyenne)",
    calories: 95,
    proteins: 0.5,
    category: "Fruits"
  },
  {
    id: "22",
    name: "Banane (1 moyenne)",
    calories: 105,
    proteins: 1.3,
    category: "Fruits"
  },
  {
    id: "23",
    name: "Orange (1 moyenne)",
    calories: 62,
    proteins: 1.2,
    category: "Fruits"
  },
  {
    id: "24",
    name: "Fraises (100g)",
    calories: 32,
    proteins: 0.7,
    category: "Fruits"
  },
  {
    id: "25",
    name: "Myrtilles (100g)",
    calories: 57,
    proteins: 0.7,
    category: "Fruits"
  },

  // Produits laitiers
  {
    id: "26",
    name: "Yaourt nature (100g)",
    calories: 59,
    proteins: 3.6,
    category: "Produits laitiers"
  },
  {
    id: "27",
    name: "Fromage blanc 0% (100g)",
    calories: 43,
    proteins: 8,
    category: "Produits laitiers"
  },
  {
    id: "28",
    name: "Skyr (100g)",
    calories: 63,
    proteins: 11,
    category: "Produits laitiers"
  },
  {
    id: "29",
    name: "Mozzarella (30g)",
    calories: 90,
    proteins: 6.6,
    category: "Produits laitiers"
  },
  {
    id: "30",
    name: "Feta (30g)",
    calories: 74,
    proteins: 4,
    category: "Produits laitiers"
  },

  // Autres
  {
    id: "31",
    name: "Amandes (30g)",
    calories: 164,
    proteins: 6,
    category: "Autres"
  },
  {
    id: "32",
    name: "Beurre de cacahuète (30g)",
    calories: 188,
    proteins: 8,
    category: "Autres"
  },
  {
    id: "33",
    name: "Huile d'olive (1 cuillère)",
    calories: 120,
    proteins: 0,
    category: "Autres"
  },
  {
    id: "34",
    name: "Avocat (1/2)",
    calories: 160,
    proteins: 2,
    category: "Autres"
  },
  {
    id: "35",
    name: "Graines de chia (30g)",
    calories: 138,
    proteins: 4.7,
    category: "Autres"
  }
];