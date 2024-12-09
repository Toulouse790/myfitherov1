export const getPreparationInstructions = (foodName: string): string => {
  const instructions: Record<string, string> = {
    // Dîners
    "Cabillaud et purée de patates douces": "Cuire les patates douces à l'eau, les réduire en purée avec le lait. Cuire le poisson à la vapeur 8-10min. Faire revenir les épinards.",
    "Buddha bowl aux falafels": "Cuire le couscous. Réchauffer les falafels au four. Disposer tous les ingrédients dans un bol, napper de sauce tahini",
    "Lentilles corail et légumes curry": "Rincer les lentilles. Les cuire 15-20min avec le lait de coco et le curry. Ajouter les légumes en cours de cuisson. Assaisonner selon vos goûts.",
    "Poulet grillé et légumes": "Griller le poulet 6-7min de chaque côté. Cuire les légumes à la vapeur.",
    "Saumon aux légumes": "Griller le saumon 4-5min de chaque côté. Faire revenir les légumes à la poêle.",
    "Tofu croustillant aux légumes sautés": "Presser le tofu 30min pour retirer l'excès d'eau. Couper en cubes, enrober de fécule. Faire revenir jusqu'à ce qu'il soit doré. Cuire les légumes dans le wok.",
    "Steak haché et riz complet": "Cuire le riz selon les instructions. Griller le steak 3-4min de chaque côté. Cuire les haricots à la vapeur.",

    // Petit-déjeuners
    "Porridge protéiné aux fruits rouges": "Faire chauffer le lait, ajouter les flocons et la protéine, mélanger et ajouter les fruits.",
    "Bowl de skyr aux myrtilles": "Verser le skyr dans un bol. Ajouter les myrtilles, le granola et un filet de miel.",
    "Smoothie bowl banane-épinards": "Mixer la banane congelée avec les épinards et le lait végétal jusqu'à obtenir une consistance crémeuse. Verser dans un bol et garnir de granola et fruits frais.",
    "Œufs brouillés sur toast complet": "Battre les œufs, les cuire à feu doux en remuant. Toaster le pain, écraser l'avocat dessus. Ajouter les œufs et les tomates.",
    "Omelette aux légumes": "Battre les œufs. Faire revenir les champignons et les épinards. Verser les œufs battus, ajouter le fromage et cuire jusqu'à ce que l'omelette soit dorée.",

    // Déjeuners
    "Bowl de tofu grillé et légumes rôtis": "Couper les légumes et la patate douce en cubes. Les disposer sur une plaque avec les pois chiches, assaisonner et rôtir 25min au four à 180°C. Pendant ce temps, couper le tofu en cubes, l'assaisonner et le griller à la poêle 3-4min de chaque côté jusqu'à ce qu'il soit doré.",
    "Salade de poulet César": "Griller le poulet et le couper en dés. Laver et couper la salade. Mélanger tous les ingrédients avec la sauce.",
    "Wrap au thon et avocat": "Égoutter le thon et l'écraser avec l'avocat. Laver et couper les légumes. Garnir les tortillas avec le mélange et les légumes, puis rouler.",
    "Houmous et crudités": "Mixer les pois chiches avec l'ail, le tahini, le jus de citron et l'huile d'olive jusqu'à obtenir une consistance lisse. Servir avec des bâtonnets de légumes.",

    // Collations
    "Mix de noix et fruits secs": "Mélanger les noix et fruits secs de votre choix dans un bol. Conserver dans un récipient hermétique.",
    "Yaourt grec aux fruits": "Verser le yaourt dans un bol, ajouter les fruits frais et un filet de miel si désiré.",
    "Smoothie protéiné": "Mixer tous les ingrédients jusqu'à obtenir une consistance lisse.",
    "Tartine avocat-œuf": "Toaster le pain. Écraser l'avocat et l'étaler sur le pain. Ajouter l'œuf poché et assaisonner."
  };

  return instructions[foodName] || "Aucune instruction disponible";
};