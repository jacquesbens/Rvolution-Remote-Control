import { PlayerStatus } from '../types';

const HTTP_TIMEOUT = 5000;

// Codes IR officiels pour les commandes R_VOLUTION
// Format: http://<player-ip-address>/cgi-bin/do?cmd=ir_code&ir_code=<CODE>
const IR_CODES = {
  // Lecture et contrôle
  PLAY_PAUSE: 'AC534040',    // Play/Pause (toggle)
  STOP: 'BD424040',          // Stop
  NEXT: 'E11E4040',          // Next
  PREVIOUS: 'E01F4040',      // Previous
  
  // Volume
  VOLUME_UP: 'E7184040',     // Volume Up
  VOLUME_DOWN: 'E8174040',   // Volume Down
  MUTE: 'BC434040',          // Mute
  
  // Navigation avancée
  FAST_FORWARD: 'E41BBF00',  // Fast Forward
  FAST_REVERSE: 'E31CBF00',  // Fast Reverse
  FORWARD_60SEC: 'EE114040', // 60 sec forward
  REWIND_60SEC: 'EF104040',  // 60 sec rewind
  FORWARD_10SEC: 'BF404040', // 10 sec forward
  REWIND_10SEC: 'DF204040',  // 10 sec rewind
  
  // Navigation curseur
  CURSOR_UP: 'F40B4040',     // Cursor Up
  CURSOR_DOWN: 'F10E4040',   // Cursor Down
  CURSOR_LEFT: 'EF104040',   // Cursor Left
  CURSOR_RIGHT: 'EE114040',  // Cursor Right
  CURSOR_ENTER: 'F20D4040',  // Cursor Enter
  
  // Menu et navigation
  HOME: 'E51A4040',          // Home
  MENU: 'BA454040',          // Menu
  INFO: 'BB444040',          // Info
  RETURN: 'BD424040',        // Return
  
  // Fonctions spéciales
  POWER_TOGGLE: 'B24D4040',  // Power Toggle
  POWER_ON: '4CB34040',      // Power On
  POWER_OFF: '4AB54040',     // Power Off
  AUDIO: 'E6194040',         // Audio
  SUBTITLE: 'E41B4040',      // Subtitle
  REPEAT: 'B9464040',        // Repeat
  ZOOM: 'E21D4040',          // Zoom
  
  // Fonctions couleur
  FUNCTION_RED: 'A68E4040',     // Function Red
  FUNCTION_GREEN: 'F50A4040',   // Function Green
  FUNCTION_YELLOW: 'BE414040',  // Function Yellow
  FUNCTION_BLUE: 'AB544040',    // Function Blue
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
      // Tester la connexion avec l'endpoint CGI
      const response = await this.fetchWithTimeout(`${this.baseUrl}/cgi-bin/do?cmd=ir_code&ir_code=TEST`);
      return response.status !== 404;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }

  // Commandes de lecture principales
  async play(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.PLAY_PAUSE);
  }

  async pause(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.PLAY_PAUSE);
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

  // Contrôle du volume
  async volumeUp(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.VOLUME_UP);
  }

  async volumeDown(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.VOLUME_DOWN);
  }

  async mute(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.MUTE);
  }

  // Navigation avancée
  async fastForward(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.FAST_FORWARD);
  }

  async fastReverse(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.FAST_REVERSE);
  }

  async forward60Sec(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.FORWARD_60SEC);
  }

  async rewind60Sec(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.REWIND_60SEC);
  }

  async forward10Sec(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.FORWARD_10SEC);
  }

  async rewind10Sec(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.REWIND_10SEC);
  }

  // Navigation curseur
  async cursorUp(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.CURSOR_UP);
  }

  async cursorDown(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.CURSOR_DOWN);
  }

  async cursorLeft(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.CURSOR_LEFT);
  }

  async cursorRight(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.CURSOR_RIGHT);
  }

  async cursorEnter(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.CURSOR_ENTER);
  }

  // Menu et navigation
  async home(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.HOME);
  }

  async menu(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.MENU);
  }

  async info(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.INFO);
  }

  async return(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.RETURN);
  }

  // Fonctions spéciales
  async powerToggle(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.POWER_TOGGLE);
  }

  async powerOn(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.POWER_ON);
  }

  async powerOff(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.POWER_OFF);
  }

  async audio(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.AUDIO);
  }

  async subtitle(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.SUBTITLE);
  }

  async repeat(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.REPEAT);
  }

  async zoom(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.ZOOM);
  }

  // Fonctions couleur
  async functionRed(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.FUNCTION_RED);
  }

  async functionGreen(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.FUNCTION_GREEN);
  }

  async functionYellow(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.FUNCTION_YELLOW);
  }

  async functionBlue(): Promise<boolean> {
    return this.sendIRCommand(IR_CODES.FUNCTION_BLUE);
  }

  // Note: Le contrôle du volume par valeur exacte n'est pas disponible avec les codes IR
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