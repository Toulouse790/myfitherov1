export const es = {
  common: {
    save: "Guardar",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Eliminar",
    next: "Siguiente",
    previous: "Anterior",
    finish: "Finalizar",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    back: "Atrás",
    confirm: "Confirmar",
    continue: "Continuar",
    search: "Buscar",
    select: "Seleccionar",
    submit: "Enviar",
    view: "Ver",
    min: "min",
    sec: "seg",
    hideDebug: "Ocultar depuración",
    showDebug: "Mostrar depuración"
  },
  settings: {
    appSettings: "Configuración de la aplicación",
    configureAppearance: "Configurar la apariencia y el idioma de la aplicación",
    theme: "Tema",
    customizeAppearance: "Personalizar apariencia",
    themeDescription: "Cambiar entre claro, oscuro o usar la configuración del sistema",
    language: "Idioma",
    selectLanguage: "Seleccionar idioma",
    languageDescription: "Elige el idioma de la interfaz de usuario",
    notifications: "Notificaciones",
    profile: "Perfil",
    account: "Cuenta",
    privacy: "Privacidad",
    security: "Seguridad",
    deleteAccount: "Eliminar cuenta"
  },
  theme: {
    lightMode: "Modo claro",
    darkMode: "Modo oscuro",
    systemMode: "Modo del sistema"
  },
  auth: {
    signIn: "Iniciar sesión",
    signUp: "Registrarse",
    signOut: "Cerrar sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    forgotPassword: "¿Olvidaste tu contraseña?",
    confirmEmail: "Confirma tu correo electrónico",
    verifying: "Verificando...",
    pleaseWait: "Por favor, espera mientras verificamos tu información.",
    error: "Error de autenticación",
    sessionExpired: "Tu sesión ha expirado, por favor inicia sesión de nuevo",
    confirmError: "Ocurrió un error durante la confirmación",
    username: "Nombre de usuario",
    confirmPassword: "Confirmar contraseña",
    rememberMe: "Recordarme",
    dontHaveAccount: "¿No tienes una cuenta?",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    resetPassword: "Restablecer contraseña"
  },
  questionnaire: {
    step: "Paso {step} de {total}",
    gender: {
      title: "¿Cuál es tu género?",
      male: "Hombre",
      female: "Mujer"
    },
    personalInfo: {
      title: "Información personal",
      age: "Edad",
      weight: "Peso",
      height: "Altura"
    },
    objective: {
      title: "¿Cuál es tu objetivo principal?",
      weightLoss: "Pérdida de peso",
      muscleGain: "Ganancia muscular",
      maintenance: "Mantenimiento"
    },
    trainingFrequency: {
      title: "Frecuencia de entrenamiento",
      sessionsPerWeek: "Sesiones por semana",
      duration: "Duración de la sesión"
    },
    activityLevel: {
      title: "Nivel de actividad",
      sedentary: "Sedentario",
      lightlyActive: "Ligeramente activo",
      moderatelyActive: "Moderadamente activo",
      veryActive: "Muy activo",
      extremelyActive: "Extremadamente activo"
    },
    training: {
      title: "¿Dónde prefieres entrenar?",
      home: "En casa",
      gym: "En el gimnasio",
      outdoor: "Al aire libre"
    },
    diet: {
      title: "Tipo de dieta",
      omnivore: "Omnívoro",
      vegetarian: "Vegetariano",
      vegan: "Vegano",
      pescetarian: "Pescetariano"
    }
  },
  profile: {
    training: {
      title: "Preferencias de entrenamiento",
      objective: {
        label: "Objetivo",
        weight_loss: "Pérdida de peso",
        muscle_gain: "Ganancia muscular",
        maintenance: "Mantenimiento"
      },
      level: {
        label: "Nivel de actividad",
        sedentary: "Sedentario",
        lightly_active: "Ligeramente activo",
        moderately_active: "Moderadamente activo",
        very_active: "Muy activo",
        extra_active: "Extremadamente activo"
      },
      equipment: {
        label: "Equipo disponible",
        home: "En casa",
        gym: "En el gimnasio",
        outdoor: "Al aire libre"
      },
      notifications: {
        label: "Notificaciones de entrenamiento",
        description: "Recibe recordatorios para tus sesiones de entrenamiento",
        reminder: {
          label: "Tiempo de recordatorio",
          30: "30 minutos antes",
          60: "1 hora antes",
          120: "2 horas antes"
        }
      },
      errors: {
        load: "No se pueden cargar tus preferencias de entrenamiento",
        update: "No se pueden actualizar tus preferencias",
        reminder: "No se puede actualizar el tiempo de recordatorio"
      },
      success: {
        update: "Tus preferencias han sido actualizadas",
        reminder: "El tiempo de recordatorio ha sido actualizado"
      }
    }
  },
  workouts: {
    title: "Entrenamientos",
    activeSession: "Entrenamiento activo",
    duration: "Duración",
    continueSession: "Continuar sesión",
    home: "Inicio",
    progress: "Progreso",
    history: "Historial",
    startWorkout: "Iniciar entrenamiento",
    createNewSession: "Crear una nueva sesión de entrenamiento",
    newWorkout: "Nuevo entrenamiento",
    latestPerformances: "Mis últimos rendimientos",
    trackProgressDescription: "Sigue tu progreso y mejora",
    viewProgress: "Ver mi progreso",
    nextGoals: "Mis próximos objetivos",
    goals: {
      trainThreeTimes: "Entrenar 3 veces por semana",
      increaseBenchPress: "Aumentar press de banca en 5kg",
      reachTrainingHours: "Alcanzar 10 horas de entrenamiento este mes"
    },
    addGoal: "Añadir objetivo",
    workoutHistory: "Historial de entrenamientos",
    noHistory: "Aún no tienes historial de entrenamientos",
    customWorkout: "Entrenamiento personalizado",
    viewFullHistory: "Ver historial completo",
    generateSession: "Generar sesión",
    generationLoading: "Generando...",
    regenerate: "Regenerar",
    startSession: "Iniciar sesión",
    startSessionLoading: "Iniciando...",
    generateWorkout: "Generar entrenamiento",
    sessionGenerated: "Sesión generada",
    exerciseLibrary: "Biblioteca de ejercicios",
    allMuscleGroups: "Todos los grupos musculares",
    searchExercises: "Buscar ejercicios",
    startWithSelected: "Comenzar con selección",
    recommendedPrograms: "Programas recomendados",
    exploreRecommended: "Explora nuestros programas recomendados",
    viewDetails: "Ver detalles",
    recentWorkouts: "Entrenamientos recientes",
    programDetails: "Detalles del programa",
    programObjectives: "Objetivos del programa",
    startProgram: "Iniciar programa",
    difficultySetting: "Nivel de dificultad",
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
    restTimer: "Temporizador de descanso",
    nextExercise: "Siguiente ejercicio",
    completeSet: "Serie completada",
    completeWorkout: "Completar entrenamiento",
    summaryTitle: "Resumen del entrenamiento",
    totalDuration: "Duración total",
    totalCalories: "Calorías quemadas",
    totalSets: "Series completadas",
    workoutPerception: "¿Cómo fue este entrenamiento?",
    todayDate: "Hoy",
    library: "Biblioteca",
    validateSet: "Validar serie",
    validateSetLabel: "Validar serie",
    restingLabel: "Descansando",
    rest: "Descanso",
    preparingNextExercise: "Preparando siguiente ejercicio",
    exerciseCompleted: "Ejercicio completado",
    sets: "series",
    reps: "repeticiones",
    restLabel: "descanso",
    minutes: "minutos",
    durationMinutes: "{duration} minutos",
    selectWorkout: "Seleccionar",
    generator: "Generador de entrenamiento",
    generatorDescription: "Crea un programa adaptado a tus objetivos y limitaciones",
    intensity: "Intensidad",
    generateWorkoutTitle: "Generar entrenamiento",
    generateWorkoutDescription: "Generaremos un entrenamiento personalizado basado en tus preferencias",
    generatingWorkout: "Generando entrenamiento...",
    workoutPreview: "Vista previa del entrenamiento",
    generationErrorTitle: "Error de generación",
    generationErrorDescription: "No se pudo generar un entrenamiento. Por favor, inténtalo de nuevo.",
    fallbackWorkoutDescription: "Entrenamiento básico adaptado a tu nivel",
    startSessionErrorTitle: "Error al iniciar sesión",
    startSessionErrorDescription: "No se pudo iniciar la sesión. Por favor, inténtalo de nuevo.",
    locationFilter: "Filtrar por ubicación de entrenamiento",
    allLocations: "Todas las ubicaciones",
    atHome: "En casa",
    atGym: "En el gimnasio",
    outdoor: "Al aire libre",
    noPrograms: "No hay programas disponibles para la ubicación de entrenamiento seleccionada.",
    teamSports: "Deportes de equipo",
    individualSports: "Deportes individuales",
    sportPrograms: "Programas deportivos",
    recommendationShort: "Corto (${min} min, ${exercises} ejercicios)",
    recommendationMedium: "Medio (${min} min, ${exercises} ejercicios)",
    recommendationLong: "Largo (${min}+ min, ${exercises} ejercicios)",
    sportSpecific: "Específico para deportes",
    sportSpecificDescription: "Accede a programas de entrenamiento adaptados a tu deporte y posición",
    chooseWorkoutType: "Elige tu tipo de entrenamiento",
    muscleGroups: "Grupos musculares",
    muscleGroupsDescription: "Entrena por grupos musculares específicos",
    recommendations: "Recomendaciones",
    formAnalysis: "Análisis de técnica",
    formAnalysisDescription: "Analiza tu técnica de ejercicio con la cámara",
    socialFeatures: "Características sociales",
    challenges: "Desafíos",
    createChallenge: "Crear desafío",
    joinChallenge: "Unirse a desafío",
    challengeFriends: "Desafiar amigos",
    communityWorkouts: "Entrenamientos comunitarios",
    exerciseForm3D: "Visualización 3D",
    muscleVisualization: "Visualización de músculos objetivo",
    virtualCoaching: "Entrenamiento virtual",
    aiFormCorrection: "Corrección de postura con IA"
  },
  nutrition: {
    title: "Nutrición",
    overview: "Visión general",
    mealPlan: "Plan de comidas",
    tracking: "Seguimiento",
    weeklyTracking: "Seguimiento semanal",
    foodJournal: "Diario de alimentación",
    todaysMeals: "Comidas de hoy",
    addMeal: "Añadir comida",
    cheatMeal: "Comida trampa",
    mealAdded: "Comida añadida",
    mealAddedSuccess: "La comida se ha añadido con éxito",
    errorAddingMeal: "No se pudo añadir la comida",
    suggestedMeal: "Comida sugerida",
    mealTypes: {
      breakfast: "Desayuno",
      morning_snack: "Tentempié de la mañana", 
      lunch: "Almuerzo",
      afternoon_snack: "Tentempié de la tarde",
      dinner: "Cena"
    },
    goals: "Objetivos nutricionales",
    dailyStats: "Estadísticas diarias",
    calories: "Calorías",
    proteins: "Proteínas",
    carbs: "Carbohidratos",
    fats: "Grasas",
    remaining: "Restante",
    consumed: "Consumido",
    target: "Objetivo",
    generatePlan: "Generar plan de comidas",
    dietary: {
      preferences: "Preferencias dietéticas",
      restrictions: "Restricciones dietéticas",
      allergies: "Alergias"
    },
    barcodeScanner: "Escáner de código de barras",
    scanFood: "Escanear alimento",
    foodImageRecognition: "Reconocimiento de imagen",
    takePhoto: "Tomar foto de comida",
    shoppingList: "Lista de compras",
    generateShoppingList: "Generar lista de compras",
    addToShoppingList: "Añadir a la lista",
    mealDelivery: "Servicios de comida",
    mealDeliveryIntegration: "Pedir ingredientes",
    waterTracking: "Seguimiento de agua",
    addWater: "Añadir agua",
    waterGoal: "Objetivo diario",
    aiRecommendations: "Recomendaciones de IA",
    nutritionInsights: "Análisis nutricionales",
    customRecipes: "Recetas personalizadas",
    createRecipe: "Crear receta",
    favoriteRecipes: "Recetas favoritas",
    saveRecipe: "Guardar receta"
  },
  sleep: {
    title: "Sueño",
    tracking: "Seguimiento del sueño",
    history: "Historial",
    analysis: "Análisis",
    trends: "Tendencias",
    correlations: "Correlaciones",
    trendChartsComing: "Gráficos de tendencias próximamente",
    exerciseImpact: "Impacto del ejercicio en el sueño",
    sleepScore: "Puntuación del sueño",
    sleepQuality: "Calidad del sueño",
    sleepDuration: "Duración del sueño",
    sleepCycles: "Ciclos de sueño",
    deepSleep: "Sueño profundo",
    remSleep: "Sueño REM",
    lightSleep: "Sueño ligero",
    fallAsleepTime: "Tiempo para dormir",
    wakeupTime: "Hora de despertar",
    connectedDevices: "Dispositivos conectados",
    connectDevice: "Conectar dispositivo",
    soundscape: "Paisaje sonoro",
    meditation: "Meditación guiada",
    sleepMeditation: "Meditación para dormir",
    relaxingSound: "Sonidos relajantes",
    sleepHypnogram: "Hipnograma del sueño",
    sleepPrediction: "Predicción del mejor momento para dormir",
    smartAlarm: "Alarma inteligente",
    setAlarm: "Configurar alarma",
    environmentalFactors: "Factores ambientales",
    temperature: "Temperatura",
    noise: "Ruido",
    light: "Luz",
    humidity: "Humedad",
    smartHomeIntegration: "Integración con hogar inteligente",
    connectSmartLights: "Conectar luces inteligentes",
    autoAdjustLights: "Ajuste automático de iluminación",
    sleepTips: "Consejos para dormir",
    dailyTip: "Consejo del día",
    save: "Guardar",
    sleepType: "Tipo de sueño",
    night: "Noche",
    duration: "Duración",
    hours: "horas",
    minutes: "minutos",
    quality: "Calidad",
    poor: "Pobre",
    fair: "Aceptable",
    good: "Buena",
    excellent: "Excelente",
    lastNight: "Anoche",
    score: "Puntuación",
    recommendedTime: "Tiempo de sueño recomendado",
    manualEntry: "Entrada manual",
    autoTracking: "Seguimiento automático",
    totalDuration: "Duración total"
  },
  difficulty: {
    easy: "Fácil",
    moderate: "Moderado",
    challenging: "Desafiante",
    intense: "Intenso",
    adaptive: "Adaptativo",
    beginner: "Principiante",
    intermediate: "Intermedio",
    advanced: "Avanzado"
  },
  muscleGroups: {
    chest: "Pecho",
    back: "Espalda",
    legs: "Piernas",
    shoulders: "Hombros",
    arms: "Brazos",
    biceps: "Bíceps",
    triceps: "Tríceps",
    abs: "Abdominales",
    full_body: "Cuerpo completo",
    upper_body: "Parte superior",
    lower_body: "Parte inferior",
    core: "Core",
    push: "Empuje",
    pull: "Tracción",
    quads: "Cuádriceps",
    hamstrings: "Isquiotibiales",
    glutes: "Glúteos",
    calves: "Pantorrillas"
  },
  locations: {
    all: "Todas las ubicaciones",
    home: "En casa",
    gym: "En el gimnasio",
    outdoor: "Al aire libre"
  },
  premium: {
    title: "Características Premium",
    unlock: "Desbloquear todas las características",
    features: "Características incluidas",
    subscribe: "Suscribirse",
    currentPlan: "Tu plan actual",
    upgradeNow: "Actualizar a Premium",
    limitReached: "Límite alcanzado",
    unlimitedAccess: "Acceso ilimitado con Premium",
    freeTrial: "Prueba gratuita",
    daysRemaining: "Días restantes: {days}",
    cancelAnytime: "Cancela cuando quieras",
    benefits: {
      aiCoaching: "Entrenamiento avanzado con IA",
      unlimitedWorkouts: "Programas de entrenamiento ilimitados",
      videoAnalysis: "Análisis de técnica en video",
      advancedStats: "Estadísticas avanzadas",
      prioritySupport: "Soporte prioritario",
      noAds: "Experiencia sin anuncios",
      exclusiveContent: "Contenido exclusivo",
      mealPlans: "Planes de comida personalizados",
      sleepAnalysis: "Análisis detallado del sueño"
    },
    membership: {
      monthly: "Mensual",
      yearly: "Anual",
      lifetime: "De por vida",
      discount: "Ahorra {percent}%"
    }
  },
  community: {
    title: "Comunidad",
    feed: "Feed",
    friends: "Amigos",
    leaderboard: "Tabla de clasificación",
    challenges: "Desafíos",
    groups: "Grupos",
    createPost: "Crear publicación",
    joinChallenge: "Unirse a desafío",
    createChallenge: "Crear desafío",
    inviteFriends: "Invitar amigos",
    searchUsers: "Buscar usuarios",
    achievements: "Logros",
    badges: "Insignias",
    progress: "Progreso",
    share: "Compartir",
    comments: "Comentarios",
    likes: "Me gusta",
    yourRank: "Tu ranking",
    globalRank: "Ranking global",
    privateGroups: "Grupos privados",
    createGroup: "Crear grupo"
  },
  analytics: {
    title: "Analíticas",
    overview: "Resumen",
    progress: "Progreso",
    predictiveInsights: "Análisis predictivo",
    performance: "Rendimiento",
    trends: "Tendencias",
    charts: "Gráficos",
    comparison: "Comparación",
    exportData: "Exportar datos",
    customReports: "Informes personalizados",
    weeklyReport: "Informe semanal",
    monthlyReport: "Informe mensual",
    yearlyReport: "Informe anual",
    healthMetrics: "Métricas de salud",
    fitnessAge: "Edad fitness",
    predictions: "Predicciones",
    overtraining: "Riesgo de sobreentrenamiento",
    recovery: "Recuperación",
    performancePrediction: "Predicción de rendimiento"
  },
  wearables: {
    title: "Dispositivos",
    connect: "Conectar dispositivo",
    disconnect: "Desconectar",
    syncData: "Sincronizar datos",
    connectedDevices: "Dispositivos conectados",
    availableDevices: "Dispositivos disponibles",
    heartRate: "Frecuencia cardíaca",
    steps: "Pasos",
    calories: "Calorías",
    activity: "Actividad",
    sleep: "Sueño",
    lastSync: "Última sincronización",
    syncNow: "Sincronizar ahora",
    addDevice: "Añadir dispositivo",
    configureDevice: "Configurar dispositivo",
    healthServices: "Servicios de salud",
    connectAppleHealth: "Conectar con Apple Health",
    connectGoogleFit: "Conectar con Google Fit",
    connectGarmin: "Conectar con Garmin",
    connectFitbit: "Conectar con Fitbit"
  }
};
