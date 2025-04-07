
// Créer un fichier s'il n'existe pas déjà
type LogLevel = 'debug' | 'log' | 'warn' | 'error';

interface IDebugLogger {
  debug: (module: string, message: string, data?: any) => void;
  log: (module: string, message: string, data?: any) => void;
  warn: (module: string, message: string, data?: any) => void;
  error: (module: string, message: string, data?: any) => void;
}

const formatMessage = (module: string, message: string) => {
  return `[${module}] ${message}`;
};

export const debugLogger: IDebugLogger = {
  debug: (module: string, message: string, data?: any) => {
    if (typeof window !== 'undefined' && window.localStorage?.getItem('debug') === 'true') {
      console.debug(formatMessage(module, message), data || '');
    }
  },
  
  log: (module: string, message: string, data?: any) => {
    console.log(formatMessage(module, message), data || '');
  },
  
  warn: (module: string, message: string, data?: any) => {
    console.warn(formatMessage(module, message), data || '');
  },
  
  error: (module: string, message: string, data?: any) => {
    console.error(formatMessage(module, message), data || '');
  }
};
