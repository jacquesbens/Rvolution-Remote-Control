import React, { useState } from 'react';
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
  const [loading, setLoading] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);

  const handleCommand = async (
    command: () => Promise<boolean>,
    commandName: string
  ) => {
    setLoading(commandName);
    try {
      console.log(`🎮 Exécution de la commande: ${commandName}`);
      const success = await command();
      if (!success) {
        Alert.alert('Erreur', `Impossible d\'exécuter la commande: ${commandName}`);
      } else {
        console.log(`✅ Commande ${commandName} exécutée avec succès`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de l\'exécution de ${commandName}:`, error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setLoading(null);
    }
  };

  const handleVolumeUp = () => {
    setVolume(prev => Math.min(100, prev + 5));
    handleCommand(() => api.volumeUp(), 'volume_up');
  };

  const handleVolumeDown = () => {
    setVolume(prev => Math.max(0, prev - 5));
    handleCommand(() => api.volumeDown(), 'volume_down');
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
          <MaterialIcons name="speaker" size={80} color="#2196F3" />
          <Text style={styles.statusTitle}>R_VOLUTION</Text>
          <Text style={styles.statusSubtitle}>Lecteur multimédia</Text>
        </View>

        <View style={styles.volumeContainer}>
          <Text style={styles.volumeLabel}>Volume</Text>
          <View style={styles.volumeControls}>
            <TouchableOpacity
              style={styles.volumeButton}
              onPress={handleVolumeDown}
              disabled={loading === 'volume_down'}
            >
              <MaterialIcons name="volume-down" size={32} color="#2196F3" />
            </TouchableOpacity>
            
            <View style={styles.volumeDisplay}>
              <Text style={styles.volumeText}>{volume}%</Text>
              <View style={styles.volumeBar}>
                <View style={[styles.volumeFill, { width: `${volume}%` }]} />
              </View>
            </View>

            <TouchableOpacity
              style={styles.volumeButton}
              onPress={handleVolumeUp}
              disabled={loading === 'volume_up'}
            >
              <MaterialIcons name="volume-up" size={32} color="#2196F3" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <Text style={styles.sectionTitle}>Contrôles de lecture</Text>
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

          <Text style={styles.sectionTitle}>Navigation</Text>
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

          <View style={styles.extraControls}>
            <TouchableOpacity
              style={styles.muteButton}
              onPress={() => handleCommand(() => api.mute(), 'mute')}
              disabled={loading === 'mute'}
            >
              <MaterialIcons name="volume-off" size={24} color="#fff" />
              <Text style={styles.muteButtonText}>Muet</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoBox}>
          <MaterialIcons name="info" size={20} color="#2196F3" />
          <Text style={styles.infoText}>
            Les commandes sont envoyées via codes IR au format:{'\n'}
            http://{device.ipAddress}/cgi-bin/do?cmd=ir_code&ir_code=...
          </Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  statusSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  volumeContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  volumeLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  volumeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  volumeButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
  },
  volumeDisplay: {
    flex: 1,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  volumeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  volumeBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
  controlsContainer: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 16,
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  extraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  muteButton: {
    backgroundColor: '#FF5722',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  muteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1976D2',
    marginLeft: 12,
    lineHeight: 18,
  },
});