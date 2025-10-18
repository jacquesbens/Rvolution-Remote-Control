import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import DeviceCard from '../components/DeviceCard';
import { RvolutionDevice } from '../types';
import { loadDevices, removeDevice, saveDevices, addDevice } from '../utils/storage';
import { checkDeviceAvailability, scanNetwork, stopScan } from '../services/networkDiscovery';

type DevicesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Devices'>;

interface Props {
  navigation: DevicesScreenNavigationProp;
}

export default function DevicesScreen({ navigation }: Props) {
  const [devices, setDevices] = useState<RvolutionDevice[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [foundDevices, setFoundDevices] = useState(0);
  const [currentIP, setCurrentIP] = useState('');
  const [discoveredDevices, setDiscoveredDevices] = useState<RvolutionDevice[]>([]);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());

  const loadDevicesList = useCallback(async () => {
    try {
      const savedDevices = await loadDevices();
      setDevices(savedDevices);
    } catch (error) {
      console.error('Error loading devices:', error);
      Alert.alert('Erreur', 'Impossible de charger les appareils');
    }
  }, []);

  useEffect(() => {
    loadDevicesList();
  }, [loadDevicesList]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDevicesList();
    });

    return unsubscribe;
  }, [navigation, loadDevicesList]);

  const checkDevicesStatus = async () => {
    const updatedDevices = await Promise.all(
      devices.map(async (device) => {
        const isOnline = await checkDeviceAvailability(device.ipAddress, device.port);
        return {
          ...device,
          isOnline,
          lastSeen: isOnline ? Date.now() : device.lastSeen,
        };
      })
    );
    
    setDevices(updatedDevices);
    await saveDevices(updatedDevices);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkDevicesStatus();
    setRefreshing(false);
  };

  const handleScanNetwork = async () => {
    // Demander confirmation avant de scanner
    Alert.alert(
      'Scanner le réseau',
      'Cette opération va scanner votre réseau local pour trouver des appareils R_VOLUTION.\n\nCela peut prendre quelques minutes.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Scanner',
          onPress: async () => {
            setScanning(true);
            setScanProgress(0);
            setFoundDevices(0);
            setDiscoveredDevices([]);

            try {
              console.log('🚀 Démarrage du scan réseau...');
              
              const tempDiscoveredDevices: RvolutionDevice[] = [];
              
              const foundDevicesList = await scanNetwork(
                (device) => {
                  // Callback appelé quand un appareil est trouvé
                  console.log('✅ Appareil découvert:', device.name, device.ipAddress);
                  setFoundDevices(prev => prev + 1);
                  tempDiscoveredDevices.push(device);
                },
                (progress) => {
                  // Callback de progression
                  setScanProgress(progress);
                },
                (ip) => {
                  // Callback pour afficher l'IP en cours de scan
                  setCurrentIP(ip);
                }
              );

              setScanning(false);
              
              if (foundDevicesList.length > 0) {
                // Afficher le modal de sélection
                setDiscoveredDevices(foundDevicesList);
                setSelectedDevices(new Set(foundDevicesList.map(d => d.id)));
                setShowSelectionModal(true);
              } else {
                Alert.alert(
                  'Aucun appareil trouvé',
                  'Aucun appareil R_VOLUTION trouvé sur le réseau.\n\n' +
                  'Vérifiez que :\n' +
                  '• Vos appareils sont allumés\n' +
                  '• Ils sont connectés au même réseau Wi-Fi\n' +
                  '• Le port 80 est accessible\n' +
                  '• L\'endpoint /status répond correctement',
                  [
                    { text: 'Réessayer', onPress: handleScanNetwork },
                    { text: 'Ajouter manuellement', onPress: () => navigation.navigate('AddDevice') },
                    { text: 'OK', style: 'cancel' }
                  ]
                );
              }
            } catch (error) {
              console.error('❌ Erreur lors du scan:', error);
              setScanning(false);
              Alert.alert(
                'Erreur',
                'Une erreur est survenue lors du scan du réseau.\n\n' +
                'Essayez d\'ajouter un appareil manuellement.',
                [
                  { text: 'Ajouter manuellement', onPress: () => navigation.navigate('AddDevice') },
                  { text: 'OK', style: 'cancel' }
                ]
              );
            }
          }
        }
      ]
    );
  };

  const handleStopScan = () => {
    Alert.alert(
      'Arrêter le scan',
      'Voulez-vous vraiment arrêter le scan en cours ?',
      [
        { text: 'Continuer', style: 'cancel' },
        {
          text: 'Arrêter',
          style: 'destructive',
          onPress: () => {
            stopScan();
            setScanning(false);
          }
        }
      ]
    );
  };

  const toggleDeviceSelection = (deviceId: string) => {
    setSelectedDevices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deviceId)) {
        newSet.delete(deviceId);
      } else {
        newSet.add(deviceId);
      }
      return newSet;
    });
  };

  const handleAddSelectedDevices = async () => {
    const devicesToAdd = discoveredDevices.filter(d => selectedDevices.has(d.id));
    
    if (devicesToAdd.length === 0) {
      Alert.alert('Aucun appareil sélectionné', 'Veuillez sélectionner au moins un appareil à ajouter.');
      return;
    }

    try {
      for (const device of devicesToAdd) {
        await addDevice(device);
      }
      
      setShowSelectionModal(false);
      setDiscoveredDevices([]);
      setSelectedDevices(new Set());
      await loadDevicesList();
      
      Alert.alert(
        'Succès',
        `${devicesToAdd.length} appareil(s) ajouté(s) avec succès`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout des appareils:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter les appareils');
    }
  };

  const handleEditDevice = (device: RvolutionDevice) => {
    navigation.navigate('EditDevice', { device });
  };

  const handleDeleteDevice = (deviceId: string) => {
    Alert.alert(
      'Supprimer l\'appareil',
      'Êtes-vous sûr de vouloir supprimer cet appareil ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await removeDevice(deviceId);
            await loadDevicesList();
          },
        },
      ]
    );
  };

  const handleDevicePress = (device: RvolutionDevice) => {
    if (device.isOnline) {
      navigation.navigate('PlayerControl', { device });
    } else {
      Alert.alert(
        'Appareil hors ligne',
        'Cet appareil n\'est pas accessible. Vérifiez qu\'il est allumé et connecté au réseau.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Appareils</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleScanNetwork}
            disabled={scanning}
          >
            <MaterialIcons name="search" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddDevice')}
          >
            <MaterialIcons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {devices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="speaker" size={80} color="#BDBDBD" />
          <Text style={styles.emptyText}>Aucun appareil</Text>
          <Text style={styles.emptySubtext}>
            Appuyez sur 🔍 pour scanner le réseau
          </Text>
          <Text style={styles.emptySubtext}>
            ou sur + pour ajouter manuellement
          </Text>
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DeviceCard
              device={item}
              onPress={() => handleDevicePress(item)}
              onEdit={() => handleEditDevice(item)}
              onDelete={() => handleDeleteDevice(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* Modal de scan */}
      <Modal
        visible={scanning}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialIcons name="search" size={60} color="#2196F3" />
            <Text style={styles.modalTitle}>Scan du réseau en cours...</Text>
            <Text style={styles.modalSubtitle}>
              Recherche d&apos;appareils R_VOLUTION
            </Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${scanProgress * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(scanProgress * 100)}%
              </Text>
            </View>

            {foundDevices > 0 && (
              <Text style={styles.foundText}>
                {foundDevices} appareil(s) trouvé(s)
              </Text>
            )}

            <Text style={styles.currentIPText}>
              Scan: {currentIP}
            </Text>

            <TouchableOpacity
              style={styles.stopButton}
              onPress={handleStopScan}
            >
              <MaterialIcons name="stop" size={24} color="#fff" />
              <Text style={styles.stopButtonText}>Arrêter le scan</Text>
            </TouchableOpacity>

            <ActivityIndicator size="large" color="#2196F3" style={styles.spinner} />
          </View>
        </View>
      </Modal>

      {/* Modal de sélection des appareils */}
      <Modal
        visible={showSelectionModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.selectionModalContent}>
            <View style={styles.selectionHeader}>
              <MaterialIcons name="devices" size={40} color="#2196F3" />
              <Text style={styles.selectionTitle}>
                Appareils trouvés
              </Text>
              <Text style={styles.selectionSubtitle}>
                Sélectionnez les appareils à ajouter
              </Text>
            </View>

            <FlatList
              data={discoveredDevices}
              keyExtractor={(item) => item.id}
              style={styles.deviceList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.deviceItem}
                  onPress={() => toggleDeviceSelection(item.id)}
                >
                  <View style={styles.deviceItemContent}>
                    <MaterialIcons 
                      name="speaker" 
                      size={32} 
                      color="#2196F3" 
                    />
                    <View style={styles.deviceItemInfo}>
                      <Text style={styles.deviceItemName}>{item.name}</Text>
                      <Text style={styles.deviceItemIP}>{item.ipAddress}:{item.port}</Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name={selectedDevices.has(item.id) ? 'check-box' : 'check-box-outline-blank'}
                    size={28}
                    color={selectedDevices.has(item.id) ? '#2196F3' : '#BDBDBD'}
                  />
                </TouchableOpacity>
              )}
            />

            <View style={styles.selectionActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowSelectionModal(false);
                  setDiscoveredDevices([]);
                  setSelectedDevices(new Set());
                }}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addButton2,
                  selectedDevices.size === 0 && styles.addButtonDisabled
                ]}
                onPress={handleAddSelectedDevices}
                disabled={selectedDevices.size === 0}
              >
                <MaterialIcons name="add" size={24} color="#fff" />
                <Text style={styles.addButtonText}>
                  Ajouter ({selectedDevices.size})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  scanButton: {
    backgroundColor: '#2196F3',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButton: {
    backgroundColor: '#2196F3',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginTop: 24,
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  foundText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 8,
  },
  currentIPText: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 16,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  spinner: {
    marginTop: 16,
  },
  selectionModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  selectionHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  selectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  deviceList: {
    maxHeight: 400,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  deviceItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceItemInfo: {
    marginLeft: 16,
    flex: 1,
  },
  deviceItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceItemIP: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  selectionActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton2: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
