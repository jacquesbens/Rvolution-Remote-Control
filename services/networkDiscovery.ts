import { RvolutionDevice } from '../types';
import { Platform } from 'react-native';

// Fonction pour obtenir l'adresse IP locale de l'appareil
const getLocalIPAddress = async (): Promise<string> => {
  // Pour le web, on peut essayer de deviner le réseau local
  if (Platform.OS === 'web') {
    return '192.168.1';
  }
  
  // Pour mobile, on retourne le réseau le plus commun
  // Dans une vraie application, vous utiliseriez react-native-network-info
  return '192.168.1';
};

// Fonction pour tester plusieurs sous-réseaux communs
const getCommonSubnets = (): string[] => {
  return [
    '192.168.1',
    '192.168.0',
    '192.168.2',
    '10.0.0',
    '10.0.1',
    '172.16.0',
  ];
};

// Fonction pour vérifier si un appareil R_VOLUTION est à cette adresse
const checkRvolutionDevice = async (
  ipAddress: string,
  port: number
): Promise<RvolutionDevice | null> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`http://${ipAddress}:${port}/status`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      let deviceName = `R_VOLUTION (${ipAddress})`;
      
      try {
        const data = await response.json();
        if (data.name) {
          deviceName = data.name;
        }
      } catch (e) {
        // Si pas de JSON, utiliser le nom par défaut
      }

      return {
        id: `${ipAddress}:${port}`,
        name: deviceName,
        ipAddress,
        port,
        isOnline: true,
        lastSeen: Date.now(),
      };
    }
  } catch (error) {
    // Appareil non trouvé ou timeout
  }
  
  return null;
};

// Fonction pour scanner le réseau local à la recherche d'appareils R_VOLUTION
export const scanNetwork = async (
  onDeviceFound?: (device: RvolutionDevice) => void,
  onProgress?: (progress: number) => void
): Promise<RvolutionDevice[]> => {
  const devices: RvolutionDevice[] = [];
  const port = 80;
  
  console.log('🔍 Démarrage du scan réseau...');
  
  // Obtenir les sous-réseaux à scanner
  const subnets = getCommonSubnets();
  const totalIPs = subnets.length * 254;
  let scannedIPs = 0;
  
  // Scanner chaque sous-réseau
  for (const subnet of subnets) {
    console.log(`📡 Scan du sous-réseau ${subnet}.x...`);
    
    // Scanner les adresses IP de 1 à 254 par batch de 20 pour éviter de surcharger
    const batchSize = 20;
    
    for (let start = 1; start <= 254; start += batchSize) {
      const end = Math.min(start + batchSize - 1, 254);
      const batchPromises: Promise<void>[] = [];
      
      for (let i = start; i <= end; i++) {
        const ipAddress = `${subnet}.${i}`;
        
        const scanPromise = (async () => {
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
  }
  
  console.log(`✨ Scan terminé. ${devices.length} appareil(s) trouvé(s).`);
  return devices;
};

// Fonction pour scanner rapidement les IPs les plus probables
export const quickScan = async (
  onDeviceFound?: (device: RvolutionDevice) => void,
  onProgress?: (progress: number) => void
): Promise<RvolutionDevice[]> => {
  const devices: RvolutionDevice[] = [];
  const port = 80;
  
  console.log('⚡ Démarrage du scan rapide...');
  
  // Scanner uniquement les IPs les plus probables (192.168.1.x et 192.168.0.x)
  const quickSubnets = ['192.168.1', '192.168.0'];
  const totalIPs = quickSubnets.length * 254;
  let scannedIPs = 0;
  
  for (const subnet of quickSubnets) {
    const batchSize = 30;
    
    for (let start = 1; start <= 254; start += batchSize) {
      const end = Math.min(start + batchSize - 1, 254);
      const batchPromises: Promise<void>[] = [];
      
      for (let i = start; i <= end; i++) {
        const ipAddress = `${subnet}.${i}`;
        
        const scanPromise = (async () => {
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

    const response = await fetch(`http://${ipAddress}:${port}/status`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
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