
export const debugLogger = {
  log: (component: string, message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${component}] ${message}`, data || '');
    }
  },
  
  error: (component: string, message: string, error?: any) => {
    console.error(`[${component}] ${message}`, error || '');
  },
  
  warn: (component: string, message: string, data?: any) => {
    console.warn(`[${component}] ${message}`, data || '');
  }
};
