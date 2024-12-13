export function getLevel(score: number): string {
  if (score < 20) return "Débutant";
  if (score < 40) return "Novice";
  if (score < 60) return "Intermédiaire";
  if (score < 80) return "Avancé";
  return "Expert";
}

export function getNextLevel(currentLevel: string): string {
  switch (currentLevel) {
    case "Débutant":
      return "Novice";
    case "Novice":
      return "Intermédiaire";
    case "Intermédiaire":
      return "Avancé";
    case "Avancé":
      return "Expert";
    default:
      return "Expert";
  }
}

export function getPointsToNextLevel(score: number, currentLevel: string): number {
  const thresholds = {
    "Débutant": 20,
    "Novice": 40,
    "Intermédiaire": 60,
    "Avancé": 80,
    "Expert": 100
  };
  
  const nextLevel = getNextLevel(currentLevel);
  return thresholds[nextLevel as keyof typeof thresholds] - score;
}

export function getLevelColor(level: string): string {
  switch (level.toLowerCase()) {
    case "débutant":
      return "text-blue-500";
    case "novice":
      return "text-green-500";
    case "intermédiaire":
      return "text-yellow-500";
    case "avancé":
      return "text-orange-500";
    case "expert":
      return "text-red-500";
    default:
      return "text-primary";
  }
}