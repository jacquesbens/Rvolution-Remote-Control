import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import DeviceCard from '../components/DeviceCard';
import { RvolutionDevice } from '../types';
import { loadDevices, removeDevice, saveDevices } from '../utils/storage';
import { checkDeviceAvailability } from '../services/networkDiscovery';

type DevicesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Devices'>;

interface Props {
  navigation: DevicesScreenNavigationProp;
}

export default function DevicesScreen({ navigation }: Props) {
  const [devices, setDevices] = useState<RvolutionDevice[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddDevice')}
        >
          <MaterialIcons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {devices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="speaker" size={80} color="#BDBDBD" />
          <Text style={styles.emptyText}>Aucun appareil</Text>
          <Text style={styles.emptySubtext}>
            Appuyez sur + pour ajouter un appareil
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
              onDelete={() => handleDeleteDevice(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
});