
export interface IDebugLogger {
  log: (context: string, message: string, data?: any) => void;
  warn: (context: string, message: string, data?: any) => void;
  error: (context: string, message: string, data?: any) => void;
  enableDebugMode: () => void;  // Assurons-nous que cette méthode est bien déclarée dans l'interface
}

class DebugLogger implements IDebugLogger {
  private isDebugMode = false;

  enableDebugMode(): void {
    this.isDebugMode = true;
    console.info('Mode debug activé');
  }

  log(context: string, message: string, data: any = {}): void {
    if (!this.isDebugMode) return;
    console.info(`[${context}] ${message}`, data);
  }

  warn(context: string, message: string, data: any = {}): void {
    if (!this.isDebugMode) return;
    console.warn(`[${context}] ${message}`, data);
  }

  error(context: string, message: string, data: any = {}): void {
    if (!this.isDebugMode) return;
    console.error(`[${context}] ${message}`, data);
  }
}

// Créer une instance singleton pour être utilisée dans toute l'application
const debugLogger: IDebugLogger = new DebugLogger();

export { debugLogger };
