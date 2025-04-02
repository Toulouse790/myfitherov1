
export const profile = {
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
      outdoor: "Outdoor"
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
      reminder: "Unable to update the reminder time"
    },
    success: {
      update: "Your preferences have been updated",
      reminder: "The reminder time has been updated"
    }
  }
};
