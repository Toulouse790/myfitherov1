
// Utilitaire pour le logging avec différents niveaux et formatage
type LogLevel = 'debug' | 'log' | 'info' | 'warn' | 'error';

class DebugLogger {
  private enabled: boolean;
  private logLevels: Record<LogLevel, boolean>;

  constructor() {
    this.enabled = true;
    this.logLevels = {
      debug: true,
      log: true,
      info: true,
      warn: true,
      error: true
    };

    // Initialiser les niveaux de log depuis localStorage s'ils existent
    this.loadConfig();
  }

  // Charger la configuration depuis localStorage
  private loadConfig(): void {
    try {
      const config = localStorage.getItem('debugLogger');
      if (config) {
        const parsedConfig = JSON.parse(config);
        this.enabled = parsedConfig.enabled ?? true;
        this.logLevels = { ...this.logLevels, ...parsedConfig.logLevels };
      }
    } catch (e) {
      console.error('Erreur lors du chargement de la configuration du logger:', e);
    }
  }

  // Sauvegarder la configuration dans localStorage
  private saveConfig(): void {
    try {
      localStorage.setItem('debugLogger', JSON.stringify({
        enabled: this.enabled,
        logLevels: this.logLevels
      }));
    } catch (e) {
      console.error('Erreur lors de la sauvegarde de la configuration du logger:', e);
    }
  }

  // Activer/désactiver le logger
  public enable(enabled: boolean): void {
    this.enabled = enabled;
    this.saveConfig();
    
    if (enabled) {
      console.log('Mode debug activé');
    } else {
      console.log('Mode debug désactivé');
    }
  }

  // Méthode pour activer le mode debug (compatibilité avec le code existant)
  public enableDebugMode(): void {
    this.enabled = true;
    this.logLevels = {
      debug: true,
      log: true,
      info: true,
      warn: true,
      error: true
    };
    this.saveConfig();
    console.log('Mode debug activé');
  }

  // Activer/désactiver un niveau de log spécifique
  public setLogLevel(level: LogLevel, enabled: boolean): void {
    this.logLevels[level] = enabled;
    this.saveConfig();
  }

  // Méthodes de logging pour chaque niveau
  public debug(context: string, message: string, ...args: any[]): void {
    this.logWithLevel('debug', context, message, ...args);
  }

  public log(context: string, message: string, ...args: any[]): void {
    this.logWithLevel('log', context, message, ...args);
  }

  public info(context: string, message: string, ...args: any[]): void {
    this.logWithLevel('info', context, message, ...args);
  }

  public warn(context: string, message: string, ...args: any[]): void {
    this.logWithLevel('warn', context, message, ...args);
  }

  public error(context: string, message: string, ...args: any[]): void {
    this.logWithLevel('error', context, message, ...args);
  }

  // Méthode interne pour gérer le logging avec formatage
  private logWithLevel(level: LogLevel, context: string, message: string, ...args: any[]): void {
    if (!this.enabled || !this.logLevels[level]) return;

    const timestamp = new Date().toISOString();
    const formattedContext = `[${context}]`;
    
    // Styles CSS pour les différents niveaux de log
    const styles: Record<LogLevel, string> = {
      debug: 'color: #6c757d', // Gris
      log: 'color: #212529',   // Noir
      info: 'color: #0275d8',  // Bleu
      warn: 'color: #f0ad4e',  // Orange
      error: 'color: #d9534f'  // Rouge
    };

    // Appliquer le style approprié
    const style = styles[level];

    // Fonction console correspondante
    const consoleMethod = level === 'debug' ? console.debug :
                         level === 'log' ? console.log :
                         level === 'info' ? console.info :
                         level === 'warn' ? console.warn :
                         console.error;

    // Afficher le log avec formatage
    consoleMethod(
      `%c${timestamp} ${formattedContext}`, 
      style, 
      message, 
      ...(args.length ? args : [])
    );
  }
}

// Exporter une instance unique
export const debugLogger = new DebugLogger();
