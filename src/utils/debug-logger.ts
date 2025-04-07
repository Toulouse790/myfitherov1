
/**
 * Utilitaire de logging amélioré pour faciliter le débogage
 */

const DEBUG_MODE = process.env.NODE_ENV === 'development' || localStorage.getItem('debug-mode') === 'true';

export const debugLogger = {
  log: (context: string, message: string, data?: any) => {
    if (DEBUG_MODE) {
      console.log(`[${context}] ${message}`, data !== undefined ? data : '');
    }
  },
  
  warn: (context: string, message: string, data?: any) => {
    if (DEBUG_MODE) {
      console.warn(`[${context}] ⚠️ ${message}`, data !== undefined ? data : '');
    }
  },
  
  error: (context: string, message: string, error?: any) => {
    // Les erreurs sont toujours loggées, même en production
    console.error(`[${context}] 🔴 ${message}`, error || '');
    
    // En mode debug, afficher plus de détails
    if (DEBUG_MODE && error) {
      if (error.stack) {
        console.error(`Stack trace:`, error.stack);
      }
    }
  },
  
  group: (context: string, title: string, logFn: () => void) => {
    if (DEBUG_MODE) {
      console.group(`[${context}] ${title}`);
      logFn();
      console.groupEnd();
    }
  },
  
  enableDebugMode: () => {
    localStorage.setItem('debug-mode', 'true');
    console.log('Mode debug activé');
  },
  
  disableDebugMode: () => {
    localStorage.removeItem('debug-mode');
    console.log('Mode debug désactivé');
  }
};
