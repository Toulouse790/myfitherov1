export const getPreparationInstructions = (foodName: string): string => {
  const instructions: Record<string, string> = {
    "Œufs brouillés sur toast complet": "Battre les œufs, les cuire à feu doux en remuant. Toaster le pain, écraser l'avocat dessus. Ajouter les œufs et les tomates.",
    "Porridge protéiné aux fruits rouges": "Faire chauffer le lait, ajouter les flocons et la protéine, mélanger et ajouter les fruits.",
    "Bowl de tofu grillé et légumes rôtis": "Couper les légumes et la patate douce en cubes. Les disposer sur une plaque avec les pois chiches, assaisonner et rôtir 25min au four à 180°C. Pendant ce temps, couper le tofu en cubes, l'assaisonner et le griller à la poêle 3-4min de chaque côté jusqu'à ce qu'il soit doré.",
    "Cabillaud et purée de patates douces": "Cuire les patates douces à l'eau, les réduire en purée avec le lait. Cuire le poisson à la vapeur 8-10min. Faire revenir les épinards.",
    "Buddha bowl aux falafels": "Cuire le couscous. Réchauffer les falafels au four. Disposer tous les ingrédients dans un bol, napper de sauce tahini",
    "Houmous et crudités": "Mixer les pois chiches avec l'ail, le tahini, le jus de citron et l'huile d'olive jusqu'à obtenir une consistance lisse. Servir avec des bâtonnets de légumes.",
    "Smoothie bowl banane-épinards": "Mixer la banane congelée avec les épinards et le lait végétal jusqu'à obtenir une consistance crémeuse. Verser dans un bol et garnir de granola et fruits frais.",
    "Wrap au thon et avocat": "Égoutter le thon et l'écraser avec l'avocat. Laver et couper les légumes. Garnir les tortillas avec le mélange et les légumes, puis rouler.",
    "Salade de poulet César": "Griller le poulet et le couper en dés. Laver et couper la salade. Mélanger tous les ingrédients avec la sauce.",
    "Saumon grillé, quinoa et légumes verts": "Faire cuire le quinoa selon les instructions. Griller le saumon 4-5min de chaque côté. Cuire les légumes à la vapeur.",
    "Omelette aux légumes": "Battre les œufs. Faire revenir les champignons et les épinards. Verser les œufs battus, ajouter le fromage et cuire jusqu'à ce que l'omelette soit dorée.",
    "Bowl de skyr aux myrtilles": "Verser le skyr dans un bol. Ajouter les myrtilles, le granola et un filet de miel.",
    "Steak haché et riz complet": "Cuire le riz selon les instructions. Griller le steak 3-4min de chaque côté. Cuire les haricots à la vapeur."
  };

  return instructions[foodName] || "Aucune instruction disponible";
};