import { RvolutionDevice } from '../types';
import { Platform } from 'react-native';

// Fonction pour obtenir l'adresse IP locale de l'appareil et extraire le sous-réseau
const getLocalSubnet = async (): Promise<string> => {
  // Pour le web, on peut essayer de deviner le réseau local
  if (Platform.OS === 'web') {
    // Essayer de détecter le réseau via une connexion WebRTC
    try {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      return new Promise((resolve) => {
        pc.onicecandidate = (ice) => {
          if (!ice || !ice.candidate || !ice.candidate.candidate) {
            resolve('192.168.1'); // Fallback
            return;
          }
          
          const ipMatch = ice.candidate.candidate.match(/(\d+\.\d+\.\d+)\.\d+/);
          if (ipMatch && ipMatch[1]) {
            resolve(ipMatch[1]);
          } else {
            resolve('192.168.1');
          }
          pc.close();
        };
        
        // Timeout après 1 seconde
        setTimeout(() => {
          resolve('192.168.1');
          pc.close();
        }, 1000);
      });
    } catch {
      return '192.168.1';
    }
  }
  
  // Pour mobile, on retourne le réseau le plus commun
  // Dans une vraie application, vous utiliseriez react-native-network-info
  return '192.168.1';
};

// Fonction pour vérifier si un appareil R_VOLUTION est à cette adresse
const checkRvolutionDevice = async (
  ipAddress: string,
  port: number
): Promise<RvolutionDevice | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    // Tester avec l'endpoint CGI
    const response = await fetch(`http://${ipAddress}:${port}/cgi-bin/do?cmd=ir_code&ir_code=TEST`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Si le serveur répond (même avec une erreur), c'est un appareil R_VOLUTION
    if (response.status !== 404) {
      const deviceName = `R_VOLUTION (${ipAddress})`;

      return {
        id: `${ipAddress}:${port}`,
        name: deviceName,
        ipAddress,
        port,
        isOnline: true,
        lastSeen: Date.now(),
      };
    }
  } catch {
    // Appareil non trouvé ou timeout
  }
  
  return null;
};

// Fonction pour scanner le réseau local à la recherche d'appareils R_VOLUTION
export const scanNetwork = async (
  onDeviceFound?: (device: RvolutionDevice) => void,
  onProgress?: (progress: number) => void,
  onIPScanned?: (ip: string) => void
): Promise<RvolutionDevice[]> => {
  const devices: RvolutionDevice[] = [];
  const port = 80;
  
  console.log('🔍 Démarrage du scan réseau...');
  
  // Obtenir le sous-réseau local
  const subnet = await getLocalSubnet();
  console.log(`📡 Scan du sous-réseau ${subnet}.x...`);
  
  const totalIPs = 254;
  let scannedIPs = 0;
  
  // Scanner les adresses IP de 1 à 254 par batch de 20 pour éviter de surcharger
  const batchSize = 20;
  
  for (let start = 1; start <= 254; start += batchSize) {
    const end = Math.min(start + batchSize - 1, 254);
    const batchPromises: Promise<void>[] = [];
    
    for (let i = start; i <= end; i++) {
      const ipAddress = `${subnet}.${i}`;
      
      const scanPromise = (async () => {
        if (onIPScanned) {
          onIPScanned(ipAddress);
        }
        
        const device = await checkRvolutionDevice(ipAddress, port);
        
        if (device) {
          console.log(`✅ Appareil trouvé: ${device.name} à ${ipAddress}`);
          devices.push(device);
          
          if (onDeviceFound) {
            onDeviceFound(device);
          }
        }
        
        scannedIPs++;
        if (onProgress) {
          onProgress(scannedIPs / totalIPs);
        }
      })();
      
      batchPromises.push(scanPromise);
    }
    
    // Attendre que le batch soit terminé avant de passer au suivant
    await Promise.all(batchPromises);
  }
  
  console.log(`✨ Scan terminé. ${devices.length} appareil(s) trouvé(s).`);
  return devices;
};

// Fonction pour scanner rapidement les IPs les plus probables
export const quickScan = async (
  onDeviceFound?: (device: RvolutionDevice) => void,
  onProgress?: (progress: number) => void,
  onIPScanned?: (ip: string) => void
): Promise<RvolutionDevice[]> => {
  const devices: RvolutionDevice[] = [];
  const port = 80;
  
  console.log('⚡ Démarrage du scan rapide...');
  
  // Obtenir le sous-réseau local
  const subnet = await getLocalSubnet();
  console.log(`📡 Scan rapide du sous-réseau ${subnet}.x...`);
  
  const totalIPs = 254;
  let scannedIPs = 0;
  
  const batchSize = 30;
  
  for (let start = 1; start <= 254; start += batchSize) {
    const end = Math.min(start + batchSize - 1, 254);
    const batchPromises: Promise<void>[] = [];
    
    for (let i = start; i <= end; i++) {
      const ipAddress = `${subnet}.${i}`;
      
      const scanPromise = (async () => {
        if (onIPScanned) {
          onIPScanned(ipAddress);
        }
        
        const device = await checkRvolutionDevice(ipAddress, port);
        
        if (device) {
          devices.push(device);
          if (onDeviceFound) {
            onDeviceFound(device);
          }
        }
        
        scannedIPs++;
        if (onProgress) {
          onProgress(scannedIPs / totalIPs);
        }
      })();
      
      batchPromises.push(scanPromise);
    }
    
    await Promise.all(batchPromises);
  }
  
  console.log(`✨ Scan rapide terminé. ${devices.length} appareil(s) trouvé(s).`);
  return devices;
};

// Fonction pour vérifier si un appareil est accessible
export const checkDeviceAvailability = async (
  ipAddress: string,
  port: number = 80
): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`http://${ipAddress}:${port}/cgi-bin/do?cmd=ir_code&ir_code=TEST`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.status !== 404;
  } catch {
    return false;
  }
};

// Fonction pour créer un appareil à partir d'une IP
export const createDeviceFromIP = async (
  ipAddress: string,
  port: number = 80
): Promise<RvolutionDevice | null> => {
  console.log(`🔍 Vérification de l'appareil à ${ipAddress}:${port}...`);
  
  const device = await checkRvolutionDevice(ipAddress, port);
  
  if (device) {
    console.log(`✅ Appareil trouvé: ${device.name}`);
    return device;
  }
  
  console.log(`❌ Aucun appareil trouvé à ${ipAddress}:${port}`);
  return null;
};
