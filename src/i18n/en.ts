
export const en = {
  common: {
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    next: "Next",
    previous: "Previous",
    finish: "Finish",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    back: "Back"
  },
  settings: {
    appSettings: "Application Settings",
    configureAppearance: "Configure the appearance and language of the application",
    theme: "Theme",
    customizeAppearance: "Customize appearance",
    themeDescription: "Switch between light, dark or use system settings",
    language: "Language",
    selectLanguage: "Select language",
    languageDescription: "Choose the user interface language"
  },
  auth: {
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    confirmEmail: "Confirm your email",
    verifying: "Verifying...",
    pleaseWait: "Please wait while we verify your information.",
    error: "Authentication Error",
    sessionExpired: "Your session has expired, please sign in again",
    confirmError: "An error occurred during confirmation"
  },
  questionnaire: {
    step: "Step {step} of {total}",
    gender: {
      title: "What is your gender?",
      male: "Male",
      female: "Female"
    },
    personalInfo: {
      title: "Personal Information",
      age: "Age",
      weight: "Weight",
      height: "Height"
    },
    objective: {
      title: "What is your main goal?",
      weightLoss: "Weight Loss",
      muscleGain: "Muscle Gain",
      maintenance: "Maintenance"
    },
    trainingFrequency: {
      title: "Training Frequency",
      sessionsPerWeek: "Sessions per week",
      duration: "Session duration"
    },
    activityLevel: {
      title: "Activity Level",
      sedentary: "Sedentary",
      lightlyActive: "Lightly Active",
      moderatelyActive: "Moderately Active",
      veryActive: "Very Active",
      extremelyActive: "Extremely Active"
    },
    training: {
      title: "Where do you prefer to train?",
      home: "At Home",
      gym: "At the Gym",
      outdoor: "Outdoors"
    },
    diet: {
      title: "Diet Type",
      omnivore: "Omnivore",
      vegetarian: "Vegetarian",
      vegan: "Vegan",
      pescetarian: "Pescetarian"
    }
  },
  profile: {
    training: {
      title: "Training Preferences",
      objective: {
        label: "Objective",
        weight_loss: "Weight Loss",
        muscle_gain: "Muscle Gain",
        maintenance: "Maintenance"
      },
      level: {
        label: "Activity Level",
        sedentary: "Sedentary",
        lightly_active: "Lightly Active",
        moderately_active: "Moderately Active",
        very_active: "Very Active",
        extra_active: "Extremely Active"
      },
      equipment: {
        label: "Available Equipment",
        home: "At Home",
        gym: "At the Gym",
        outdoor: "Outdoors"
      },
      notifications: {
        label: "Training Notifications",
        description: "Receive reminders for your training sessions",
        reminder: {
          label: "Reminder Time",
          30: "30 minutes before",
          60: "1 hour before",
          120: "2 hours before"
        }
      },
      errors: {
        load: "Unable to load your training preferences",
        update: "Unable to update your preferences",
        reminder: "Unable to update reminder time"
      },
      success: {
        update: "Your preferences have been updated",
        reminder: "Reminder time has been updated"
      }
    }
  },
  workouts: {
    activeSession: "Active Workout",
    duration: "Duration",
    continueSession: "Continue Session",
    home: "Home",
    progress: "Progress",
    history: "History",
    startWorkout: "Start a Workout",
    createNewSession: "Create a new workout session",
    newWorkout: "New Workout",
    latestPerformances: "My Latest Performances",
    trackProgressDescription: "Track your progress and improve",
    viewProgress: "View My Progress",
    nextGoals: "My Next Goals",
    goals: {
      trainThreeTimes: "Train 3 times per week",
      increaseBenchPress: "Increase bench press by 5kg",
      reachTrainingHours: "Reach 10 hours of training this month"
    },
    addGoal: "Add Goal",
    workoutHistory: "Workout History",
    noHistory: "You don't have any workout history yet",
    customWorkout: "Custom Workout",
    viewFullHistory: "View Full History"
  },
  nutrition: {
    title: "Nutrition",
    overview: "Overview",
    mealPlan: "Meal Plan",
    tracking: "Tracking",
    weeklyTracking: "Weekly Tracking",
    foodJournal: "Food Journal",
    todaysMeals: "Today's Meals",
    addMeal: "Add Meal",
    cheatMeal: "Cheat Meal",
    mealAdded: "Meal Added",
    mealAddedSuccess: "The meal was successfully added",
    errorAddingMeal: "Unable to add the meal",
    suggestedMeal: "Suggested Meal",
    mealTypes: {
      breakfast: "Breakfast",
      morning_snack: "Morning Snack", 
      lunch: "Lunch",
      afternoon_snack: "Afternoon Snack",
      dinner: "Dinner"
    },
    goals: "Nutrition Goals",
    dailyStats: "Daily Statistics",
    calories: "Calories",
    proteins: "Proteins",
    carbs: "Carbohydrates",
    fats: "Fats",
    remaining: "Remaining",
    consumed: "Consumed",
    target: "Target",
    generatePlan: "Generate Meal Plan",
    dietary: {
      preferences: "Dietary Preferences",
      restrictions: "Dietary Restrictions",
      allergies: "Allergies"
    }
  }
};
