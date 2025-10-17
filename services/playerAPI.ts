import { PlayerStatus } from '../types';

const HTTP_TIMEOUT = 5000;

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

  async checkConnection(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/status`);
      return response.ok;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }

  async play(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/play`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Play command failed:', error);
      return false;
    }
  }

  async pause(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/pause`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Pause command failed:', error);
      return false;
    }
  }

  async stop(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/stop`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Stop command failed:', error);
      return false;
    }
  }

  async next(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/next`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Next command failed:', error);
      return false;
    }
  }

  async previous(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/previous`, {
        method: 'POST',
      });
      return response.ok;
    } catch (error) {
      console.error('Previous command failed:', error);
      return false;
    }
  }

  async setVolume(volume: number): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/volume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ volume: Math.max(0, Math.min(100, volume)) }),
      });
      return response.ok;
    } catch (error) {
      console.error('Set volume failed:', error);
      return false;
    }
  }

  async getStatus(): Promise<PlayerStatus | null> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/status`);
      if (response.ok) {
        const data = await response.json();
        return data as PlayerStatus;
      }
      return null;
    } catch (error) {
      console.error('Get status failed:', error);
      return null;
    }
  }
}