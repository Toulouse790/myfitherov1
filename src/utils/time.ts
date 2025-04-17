
export const formatWorkoutTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const formatDate = (dateString: string | undefined, locale: string = 'fr-FR'): string => {
  if (!dateString) return 'Non défini';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date invalide';
  }
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

export const getCurrentMonth = (): number => {
  return new Date().getMonth(); // 0-indexed (0 = January, 11 = December)
};

export const getCurrentMonthName = (locale: string = 'fr-FR'): string => {
  const date = new Date();
  return date.toLocaleDateString(locale, { month: 'long' });
};

export const formatMonthYear = (date: Date, locale: string = 'fr-FR'): string => {
  return date.toLocaleDateString(locale, { 
    month: 'long', 
    year: 'numeric' 
  });
};
