import { RvolutionDevice } from '../types';

// Fonction pour obtenir l'adresse IP locale de l'appareil
const getLocalIPAddress = (): string => {
  // Cette fonction retourne une estimation de l'adresse IP locale
  // En production, vous pourriez utiliser une bibliothèque native pour obtenir l'IP réelle
  return '192.168.1';
};

// Fonction pour scanner le réseau local à la recherche d'appareils R_VOLUTION
export const scanNetwork = async (
  onDeviceFound?: (device: RvolutionDevice) => void,
  onProgress?: (progress: number) => void
): Promise<RvolutionDevice[]> => {
  const devices: RvolutionDevice[] = [];
  const baseIP = getLocalIPAddress();
  const port = 80;
  
  console.log('Network scan started...');
  
  // Scanner les adresses IP de 1 à 254
  const scanPromises: Promise<void>[] = [];
  
  for (let i = 1; i <= 254; i++) {
    const ipAddress = `${baseIP}.${i}`;
    
    const scanPromise = (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000); // Timeout court pour le scan

        const response = await fetch(`http://${ipAddress}:${port}/status`, {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          // Essayer de récupérer le nom de l'appareil
          let deviceName = `R_VOLUTION (${ipAddress})`;
          
          try {
            const data = await response.json();
            if (data.name && data.name.includes('R_VOLUTION')) {
              deviceName = data.name;
            }
          } catch (e) {
            // Si pas de JSON, utiliser le nom par défaut
          }

          const device: RvolutionDevice = {
            id: `${ipAddress}:${port}`,
            name: deviceName,
            ipAddress,
            port,
            isOnline: true,
            lastSeen: Date.now(),
          };

          devices.push(device);
          
          if (onDeviceFound) {
            onDeviceFound(device);
          }
        }
      } catch (error) {
        // Ignorer les erreurs de connexion (appareil non trouvé)
      }
      
      if (onProgress) {
        onProgress(i / 254);
      }
    })();
    
    scanPromises.push(scanPromise);
  }
  
  await Promise.all(scanPromises);
  
  console.log(`Network scan completed. Found ${devices.length} devices.`);
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
  const isAvailable = await checkDeviceAvailability(ipAddress, port);
  
  if (isAvailable) {
    return {
      id: `${ipAddress}:${port}`,
      name: `R_VOLUTION (${ipAddress})`,
      ipAddress,
      port,
      isOnline: true,
      lastSeen: Date.now(),
    };
  }
  
  return null;
};
