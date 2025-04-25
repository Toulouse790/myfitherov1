export const workouts = {
  title: "Entrenamientos",
  createSession: "Crear sesión",
  createCustomSession: "Crea una sesión de entrenamiento personalizada",
  generateSession: "Generar sesión",
  aiGeneratedSession: "Obtén una sesión generada por IA adaptada a tus necesidades",
  sportSpecific: "Específico para deportes",
  programsForYourSport: "Programas adaptados a tu deporte y posición",
  recentPerformances: "Rendimientos recientes",
  trackProgressDescription: "Sigue tu progreso y mejora tu rendimiento",
  createMySession: "Crear mi sesión",
  generateMySession: "Generar mi sesión",
  sportPrograms: "Programas deportivos",
  viewMyProgress: "Ver mi progreso",
  startWorkout: "Comenzar entrenamiento",
  generateProgram: "Generar programa",
  muscleGroups: {
    pectorals: "Pectorales",
    biceps: "Bíceps",
    triceps: "Tríceps",
    shoulders: "Hombros",
    back: "Espalda",
    legs: "Piernas",
    abs: "Abdominales",
    glutes: "Glúteos"
  },
  workoutTypes: {
    strength: "Fuerza",
    cardio: "Cardio",
    hiit: "HIIT",
    yoga: "Yoga",
    pilates: "Pilates",
    stretching: "Estiramientos"
  },
  equipment: {
    none: "Ninguno",
    dumbbells: "Mancuernas",
    barbell: "Barra",
    kettlebell: "Pesa rusa",
    resistanceBands: "Bandas de resistencia",
    machines: "Máquinas"
  },
  intensity: {
    low: "Baja",
    medium: "Media",
    high: "Alta"
  },
  duration: {
    short: "Corta (15-30 min)",
    medium: "Media (30-45 min)",
    long: "Larga (45-60 min)"
  },
  objectives: {
    weightLoss: "Pérdida de peso",
    muscleGain: "Ganancia muscular",
    endurance: "Resistencia",
    flexibility: "Flexibilidad",
    overallFitness: "Fitness general"
  },
  form: {
    good: "Buena",
    moderate: "Moderada",
    bad: "Mala"
  },
  session: {
    active: "Sesión activa",
    completed: "Completada",
    missed: "Perdida"
  },
  actions: {
    start: "Comenzar",
    pause: "Pausar",
    resume: "Reanudar",
    finish: "Finalizar",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Eliminar"
  },
  messages: {
    startSession: "¿Comenzar sesión?",
    endSession: "¿Finalizar sesión?",
    cancelSession: "¿Cancelar sesión?",
    deleteSession: "¿Eliminar sesión?",
    sessionStarted: "Sesión iniciada",
    sessionEnded: "Sesión finalizada",
    sessionCancelled: "Sesión cancelada",
    sessionDeleted: "Sesión eliminada"
  },
  hints: {
    adjustReps: "Ajusta las repeticiones según tu nivel",
    focusForm: "Concéntrate en la forma correcta",
    stayHydrated: "Mantente hidratado"
  },
  labels: {
    reps: "Repeticiones",
    sets: "Series",
    weight: "Peso",
    rest: "Descanso",
    exercise: "Ejercicio",
    workout: "Entrenamiento",
    time: "Tiempo",
    calories: "Calorías",
    distance: "Distancia",
    speed: "Velocidad",
    heartRate: "Frecuencia cardíaca"
  },
  placeholders: {
    searchExercise: "Buscar ejercicio",
    addNote: "Añadir nota"
  },
  tooltips: {
    editExercise: "Editar ejercicio",
    deleteExercise: "Eliminar ejercicio",
    addSet: "Añadir serie",
    deleteSet: "Eliminar serie"
  },
  filters: {
    muscleGroup: "Grupo muscular",
    workoutType: "Tipo de entrenamiento",
    equipment: "Equipo",
    intensity: "Intensidad",
    duration: "Duración",
    objective: "Objetivo"
  },
  sort: {
    nameAsc: "Nombre (A-Z)",
    nameDesc: "Nombre (Z-A)",
    dateAsc: "Fecha (Más antigua)",
    dateDesc: "Fecha (Más reciente)"
  },
  progress: {
    title: "Progreso del entrenamiento",
    description: "Sigue tu progreso a lo largo del tiempo",
    charts: {
      volume: "Volumen total",
      exercises: "Ejercicios completados",
      duration: "Duración promedio"
    },
    labels: {
      volume: "Volumen",
      exercises: "Ejercicios",
      duration: "Duración"
    }
  },
  create: {
    title: "Crear entrenamiento",
    description: "Crea tu propio entrenamiento personalizado",
    steps: {
      selectExercises: "Seleccionar ejercicios",
      arrangeExercises: "Organizar ejercicios",
      customizeDetails: "Personalizar detalles"
    },
    labels: {
      exerciseName: "Nombre del ejercicio",
      setsRepsWeight: "Series, repeticiones y peso",
      restTime: "Tiempo de descanso"
    },
    placeholders: {
      exerciseName: "Buscar o añadir ejercicio",
      sets: "Series",
      reps: "Repeticiones",
      weight: "Peso (kg)",
      rest: "Tiempo (segundos)"
    },
    buttons: {
      addExercise: "Añadir ejercicio",
      removeExercise: "Eliminar ejercicio",
      addSet: "Añadir serie",
      removeSet: "Eliminar serie",
      saveWorkout: "Guardar entrenamiento"
    },
    messages: {
      workoutCreated: "Entrenamiento creado con éxito",
      workoutUpdated: "Entrenamiento actualizado con éxito",
      workoutDeleted: "Entrenamiento eliminado con éxito"
    }
  },
  generate: {
    title: "Generar entrenamiento",
    description: "Genera un entrenamiento personalizado con IA",
    labels: {
      muscleGroups: "Grupos musculares",
      workoutType: "Tipo de entrenamiento",
      equipment: "Equipo",
      intensity: "Intensidad",
      duration: "Duración",
      objective: "Objetivo"
    },
    placeholders: {
      selectMuscleGroups: "Seleccionar grupos musculares",
      selectWorkoutType: "Seleccionar tipo de entrenamiento",
      selectEquipment: "Seleccionar equipo",
      selectIntensity: "Seleccionar intensidad",
      selectDuration: "Seleccionar duración",
      selectObjective: "Seleccionar objetivo"
    },
    buttons: {
      generateWorkout: "Generar entrenamiento",
      regenerateWorkout: "Regenerar entrenamiento"
    },
    messages: {
      workoutGenerated: "Entrenamiento generado con éxito",
      workoutRegenerated: "Entrenamiento regenerado con éxito"
    }
  },
  sportProgramsSection: {
    title: "Programas deportivos",
    description: "Programas adaptados a tu deporte y posición",
    labels: {
      sport: "Deporte",
      position: "Posición"
    },
    placeholders: {
      selectSport: "Seleccionar deporte",
      selectPosition: "Seleccionar posición"
    },
    buttons: {
      viewProgram: "Ver programa"
    }
  }
};
