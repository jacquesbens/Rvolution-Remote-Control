import { PlayerStatus } from '../types';

const HTTP_TIMEOUT = 5000;

// Codes IR pour les commandes R_VOLUTION
// Format: http://<player-ip-address>/cgi-bin/do?cmd=ir_code&ir_code=<CODE>
const IR_CODES = {
  PLAY: 'F10E4040',        // Code IR pour Play
  PAUSE: 'F10E4041',       // Code IR pour Pause
  STOP: 'F10E4042',        // Code IR pour Stop
  NEXT: 'F10E4043',        // Code IR pour Next
  PREVIOUS: 'F10E4044',    // Code IR pour Previous
  VOLUME_UP: 'F10E4045',   // Code IR pour Volume +
  VOLUME_DOWN: 'F10E4046', // Code IR pour Volume -
  MUTE: 'F10E4047',        // Code IR pour Mute
};

export class RvolutionPlayerAPI {
  private baseUrl: string;

  constructor(ipAddress: string, port: number = 80) {
    this.baseUrl = `http://${ipAddress}:${port}`;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HTTP_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async sendIRCommand(irCode: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}/cgi-bin/do?cmd=ir_code&ir_code=${irCode}`;
      console.log(`📡 Envoi commande IR: ${url}`);
      
      const response = await this.fetchWithTimeout(url, {
        method: 'GET',
      });
      
      console.log(`✅ Réponse: ${response.status}`);
      return response.ok;
    } catch (error) {
      console.error('❌ Erreur commande IR:', error);
      return false;
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      // Tester la connexion avec une commande simple
      const response = await this.fetchWithTimeout(`${this.baseUrl}/cgi-bin/do?cmd=ir_code&ir_code=TEST`);
      return response.status !== 404; // Si le serveur répond (même avec une erreur), il est accessible
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }

  async play(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.PLAY);
  }

  async pause(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.PAUSE);
  }

  async stop(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.STOP);
  }

  async next(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.NEXT);
  }

  async previous(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.PREVIOUS);
  }

  async volumeUp(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.VOLUME_UP);
  }

  async volumeDown(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.VOLUME_DOWN);
  }

  async mute(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.MUTE);
  }

  // Note: Le contrôle du volume par valeur exacte n'est pas disponible avec les codes IR
  // On utilise volumeUp/volumeDown à la place
  async setVolume(volume: number): Promise<boolean> {
    console.warn('setVolume: Le contrôle du volume par valeur exacte n\'est pas disponible avec les codes IR');
    return false;
  }

  // Note: La récupération du statut n'est pas disponible avec cette API
  async getStatus(): Promise<PlayerStatus | null> {
    console.warn('getStatus: La récupération du statut n\'est pas disponible avec cette API');
    return null;
  }
}