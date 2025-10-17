export interface RvolutionDevice {
  id: string;
  name: string;
  ipAddress: string;
  port: number;
  isOnline: boolean;
  lastSeen?: number;
}

export interface PlayerStatus {
  isPlaying: boolean;
  volume: number;
  currentTrack?: string;
  duration?: number;
  position?: number;
}

export interface NetworkScanResult {
  devices: RvolutionDevice[];
  scanTime: number;
}