
const DEBUG_AUTH = process.env.NODE_ENV === 'development';

export const authLogger = {
  info: (message: string, ...args: any[]) => {
    if (DEBUG_AUTH) {
      console.info(`🔐 [Auth]: ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (DEBUG_AUTH) {
      console.warn(`⚠️ [Auth]: ${message}`, ...args);
    }
  },
  
  error: (message: string, ...args: any[]) => {
    // Les erreurs sont toujours loggées, même en production
    console.error(`❌ [Auth]: ${message}`, ...args);
  },
  
  success: (message: string, ...args: any[]) => {
    if (DEBUG_AUTH) {
      console.log(`✅ [Auth]: ${message}`, ...args);
    }
  },

  debug: (message: string, ...args: any[]) => {
    if (DEBUG_AUTH) {
      console.debug(`🔍 [Auth]: ${message}`, ...args);
    }
  },

  trace: (message: string, context: Record<string, any> = {}) => {
    if (DEBUG_AUTH) {
      console.groupCollapsed(`🔍 [Auth Trace]: ${message}`);
      Object.entries(context).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });
      console.groupEnd();
    }
  }
};
