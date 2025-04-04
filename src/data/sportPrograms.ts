
import { SportProgram } from "@/utils/api/sportProgramsApi";

// Créer des exercices pour différents sports et niveaux
const createExercisesForLevel = (sport: string, position: string, level: string): string[] => {
  const baseDifficulty = level === 'amateur' ? 'basiques' : level === 'semi-pro' ? 'intermédiaires' : 'avancés';
  
  if (sport === 'football') {
    if (position === 'gardien') {
      return [
        `Plongeons ${baseDifficulty}`,
        `Réflexes ${baseDifficulty}`,
        `Sorties aériennes ${baseDifficulty}`,
        `Jeu au pied ${baseDifficulty}`,
        `Exercices de placement ${baseDifficulty}`
      ];
    } else if (position === 'défenseur') {
      return [
        `Tacles ${baseDifficulty}`,
        `Jeu de tête ${baseDifficulty}`,
        `Placement défensif ${baseDifficulty}`,
        `Relances ${baseDifficulty}`,
        `Duels ${baseDifficulty}`
      ];
    } else if (position === 'milieu') {
      return [
        `Passes courtes ${baseDifficulty}`,
        `Passes longues ${baseDifficulty}`,
        `Contrôles orientés ${baseDifficulty}`,
        `Transitions ${baseDifficulty}`,
        `Endurance spécifique ${baseDifficulty}`
      ];
    } else if (position === 'attaquant') {
      return [
        `Finitions ${baseDifficulty}`,
        `Dribbles ${baseDifficulty}`,
        `Déplacements ${baseDifficulty}`,
        `Frappes ${baseDifficulty}`,
        `Jeu sans ballon ${baseDifficulty}`
      ];
    }
  } else if (sport === 'basketball') {
    if (position === 'meneur') {
      return [
        `Dribbles ${baseDifficulty}`,
        `Passes ${baseDifficulty}`,
        `Vision de jeu ${baseDifficulty}`,
        `Tirs extérieurs ${baseDifficulty}`,
        `Défense sur porteur ${baseDifficulty}`
      ];
    } else if (position === 'ailier') {
      return [
        `Tirs à mi-distance ${baseDifficulty}`,
        `Pénétrations ${baseDifficulty}`,
        `Défense polyvalente ${baseDifficulty}`,
        `Rebonds ${baseDifficulty}`,
        `Jeu de transition ${baseDifficulty}`
      ];
    } else if (position === 'pivot') {
      return [
        `Jeu au poste bas ${baseDifficulty}`,
        `Rebonds offensifs ${baseDifficulty}`,
        `Rebonds défensifs ${baseDifficulty}`,
        `Protection de cercle ${baseDifficulty}`,
        `Écrans ${baseDifficulty}`
      ];
    }
  } else if (sport === 'tennis') {
    return [
      `Coups droits ${baseDifficulty}`,
      `Revers ${baseDifficulty}`,
      `Services ${baseDifficulty}`,
      `Volées ${baseDifficulty}`,
      `Jeu de jambes ${baseDifficulty}`,
      `Endurance spécifique ${baseDifficulty}`
    ];
  } else if (sport === 'natation') {
    if (position === 'sprint') {
      return [
        `Techniques de départ ${baseDifficulty}`,
        `Virages rapides ${baseDifficulty}`,
        `Crawl explosif ${baseDifficulty}`,
        `Renforcement spécifique ${baseDifficulty}`,
        `Travail d'explosivité ${baseDifficulty}`
      ];
    } else if (position === 'endurance') {
      return [
        `Séries longues ${baseDifficulty}`,
        `Gestion du rythme ${baseDifficulty}`,
        `Efficacité technique ${baseDifficulty}`,
        `Endurance cardio-vasculaire ${baseDifficulty}`,
        `Récupération active ${baseDifficulty}`
      ];
    }
  }
  
  // Exercices génériques pour tout sport/position non spécifié
  return [
    `Échauffement ${baseDifficulty}`,
    `Exercices techniques ${baseDifficulty}`,
    `Exercices physiques ${baseDifficulty}`,
    `Exercices tactiques ${baseDifficulty}`,
    `Récupération ${baseDifficulty}`
  ];
};

// Fonction pour générer un programme sportif
const createProgram = (
  sportId: string, 
  sportName: string, 
  positionId: string, 
  positionName: string, 
  difficulty: string
): SportProgram => {
  // Paramètres selon le niveau
  const durations = { 'amateur': 6, 'semi-pro': 8, 'pro': 12 };
  const sessions = { 'amateur': 3, 'semi-pro': 4, 'pro': 5 };
  const difficultyLabel = difficulty === 'amateur' ? 'débutant' : 
                         difficulty === 'semi-pro' ? 'intermédiaire' : 'avancé';
  
  return {
    id: `${sportId}-${positionId}-${difficulty}`,
    name: `Programme ${sportName} - ${positionName} - Niveau ${difficultyLabel}`,
    description: `Programme d'entraînement ${difficultyLabel} pour ${positionName} de ${sportName}`,
    sport_id: sportId,
    position_id: positionId,
    difficulty: difficulty,
    duration: durations[difficulty as keyof typeof durations],
    sessionsPerWeek: sessions[difficulty as keyof typeof sessions],
    exercises: createExercisesForLevel(sportName, positionName, difficulty)
  };
};

// Création des programmes pour tous les sports et positions
export const generateSportPrograms = (): SportProgram[] => {
  const programs: SportProgram[] = [];
  
  // Sports collectifs
  const teamSports = [
    { id: 'football', name: 'Football', positions: [
      { id: 'gardien', name: 'Gardien' },
      { id: 'défenseur', name: 'Défenseur' },
      { id: 'milieu', name: 'Milieu' },
      { id: 'attaquant', name: 'Attaquant' }
    ]},
    { id: 'basketball', name: 'Basketball', positions: [
      { id: 'meneur', name: 'Meneur' },
      { id: 'ailier', name: 'Ailier' },
      { id: 'pivot', name: 'Pivot' }
    ]},
    { id: 'volleyball', name: 'Volleyball', positions: [
      { id: 'passeur', name: 'Passeur' },
      { id: 'attaquant', name: 'Attaquant' },
      { id: 'libero', name: 'Libéro' }
    ]}
  ];
  
  // Sports individuels
  const individualSports = [
    { id: 'tennis', name: 'Tennis', positions: [
      { id: 'general', name: 'Général' }
    ]},
    { id: 'natation', name: 'Natation', positions: [
      { id: 'sprint', name: 'Sprint' },
      { id: 'endurance', name: 'Endurance' }
    ]},
    { id: 'running', name: 'Course à pied', positions: [
      { id: 'general', name: 'Général' }
    ]}
  ];
  
  // Niveaux de difficulté
  const difficulties = ['amateur', 'semi-pro', 'pro'];
  
  // Générer les programmes pour chaque sport, position et niveau
  [...teamSports, ...individualSports].forEach(sport => {
    sport.positions.forEach(position => {
      difficulties.forEach(difficulty => {
        programs.push(createProgram(sport.id, sport.name, position.id, position.name, difficulty));
      });
    });
  });
  
  return programs;
};

// Programmes générés exportables
export const allSportPrograms = generateSportPrograms();
