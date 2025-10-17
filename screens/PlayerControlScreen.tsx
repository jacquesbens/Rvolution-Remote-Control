import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import ControlButton from '../components/ControlButton';
import { RvolutionPlayerAPI } from '../services/playerAPI';
import { PlayerStatus } from '../types';
import Slider from '@react-native-community/slider';

type PlayerControlScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PlayerControl'
>;
type PlayerControlScreenRouteProp = RouteProp<RootStackParamList, 'PlayerControl'>;

interface Props {
  navigation: PlayerControlScreenNavigationProp;
  route: PlayerControlScreenRouteProp;
}

export default function PlayerControlScreen({ navigation, route }: Props) {
  const { device } = route.params;
  const [api] = useState(() => new RvolutionPlayerAPI(device.ipAddress, device.port));
  const [status, setStatus] = useState<PlayerStatus | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadStatus = async () => {
    try {
      const playerStatus = await api.getStatus();
      if (playerStatus) {
        setStatus(playerStatus);
        setVolume(playerStatus.volume);
      }
    } catch (error) {
      console.error('Error loading status:', error);
    }
  };

  const handleCommand = async (
    command: () => Promise<boolean>,
    commandName: string
  ) => {
    setLoading(commandName);
    try {
      const success = await command();
      if (!success) {
        Alert.alert('Erreur', `Impossible d\'exécuter la commande: ${commandName}`);
      } else {
        await loadStatus();
      }
    } catch (error) {
      console.error(`Error executing ${commandName}:`, error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(null);
    }
  };

  const handleVolumeChange = async (value: number) => {
    setVolume(value);
  };

  const handleVolumeComplete = async (value: number) => {
    try {
      await api.setVolume(Math.round(value));
      await loadStatus();
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <Text style={styles.deviceIP}>{device.ipAddress}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusCard}>
          <MaterialIcons name="speaker" size={60} color="#2196F3" />
          <Text style={styles.statusTitle}>
            {status?.isPlaying ? 'Lecture en cours' : 'En pause'}
          </Text>
          {status?.currentTrack && (
            <Text style={styles.trackName}>{status.currentTrack}</Text>
          )}
        </View>

        <View style={styles.volumeContainer}>
          <MaterialIcons name="volume-down" size={24} color="#666" />
          <Slider
            style={styles.volumeSlider}
            minimumValue={0}
            maximumValue={100}
            value={volume}
            onValueChange={handleVolumeChange}
            onSlidingComplete={handleVolumeComplete}
            minimumTrackTintColor="#2196F3"
            maximumTrackTintColor="#BDBDBD"
            thumbTintColor="#2196F3"
          />
          <MaterialIcons name="volume-up" size={24} color="#666" />
          <Text style={styles.volumeText}>{Math.round(volume)}%</Text>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.mainControls}>
            <ControlButton
              icon="play-arrow"
              label="Lecture"
              onPress={() => handleCommand(() => api.play(), 'play')}
              loading={loading === 'play'}
            />
            <ControlButton
              icon="pause"
              label="Pause"
              onPress={() => handleCommand(() => api.pause(), 'pause')}
              loading={loading === 'pause'}
            />
            <ControlButton
              icon="stop"
              label="Stop"
              onPress={() => handleCommand(() => api.stop(), 'stop')}
              loading={loading === 'stop'}
            />
          </View>

          <View style={styles.navigationControls}>
            <ControlButton
              icon="skip-previous"
              label="Précédent"
              onPress={() => handleCommand(() => api.previous(), 'previous')}
              loading={loading === 'previous'}
              size="small"
            />
            <ControlButton
              icon="skip-next"
              label="Suivant"
              onPress={() => handleCommand(() => api.next(), 'next')}
              loading={loading === 'next'}
              size="small"
            />
          </View>
        </View>
      </ScrollView>
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
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceIP: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  trackName: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  volumeSlider: {
    flex: 1,
    marginHorizontal: 12,
  },
  volumeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
    minWidth: 50,
    textAlign: 'right',
  },
  controlsContainer: {
    alignItems: 'center',
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});