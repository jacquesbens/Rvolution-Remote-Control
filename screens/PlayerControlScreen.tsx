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

  const renderSmallButton = (
    icon: keyof typeof MaterialIcons.glyphMap,
    label: string,
    command: () => Promise<boolean>,
    commandName: string,
    color?: string
  ) => (
    <TouchableOpacity
      style={[styles.smallButton, color && { backgroundColor: color }]}
      onPress={() => handleCommand(command, commandName)}
      disabled={loading === commandName}
    >
      <MaterialIcons name={icon} size={24} color="#fff" />
      <Text style={styles.smallButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  const renderNumberButton = (number: number) => (
    <TouchableOpacity
      style={styles.numberButton}
      onPress={() => handleCommand(() => (api as any)[`digit${number}`](), `digit_${number}`)}
      disabled={loading === `digit_${number}`}
    >
      <Text style={styles.numberButtonText}>{number}</Text>
    </TouchableOpacity>
  );

  const renderNumpadButton = (
    icon: keyof typeof MaterialIcons.glyphMap,
    label: string,
    command: () => Promise<boolean>,
    commandName: string
  ) => (
    <TouchableOpacity
      style={styles.numberButton}
      onPress={() => handleCommand(command, commandName)}
      disabled={loading === commandName}
    >
      <MaterialIcons name={icon} size={32} color="#fff" />
      <Text style={styles.numpadButtonText}>{label}</Text>
    </TouchableOpacity>
  );

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
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Alimentation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Alimentation</Text>
          <View style={styles.powerRow}>
            {renderSmallButton('power-settings-new', 'Power', () => api.powerToggle(), 'power_toggle', '#F44336')}
            {renderSmallButton('power', 'ON', () => api.powerOn(), 'power_on', '#2196F3')}
            {renderSmallButton('power-off', 'OFF', () => api.powerOff(), 'power_off', '#9E9E9E')}
          </View>
        </View>

        {/* Pavé numérique */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔢 Pavé numérique</Text>
          <View style={styles.numberPad}>
            <View style={styles.numberRow}>
              {renderNumberButton(1)}
              {renderNumberButton(2)}
              {renderNumberButton(3)}
            </View>
            <View style={styles.numberRow}>
              {renderNumberButton(4)}
              {renderNumberButton(5)}
              {renderNumberButton(6)}
            </View>
            <View style={styles.numberRow}>
              {renderNumberButton(7)}
              {renderNumberButton(8)}
              {renderNumberButton(9)}
            </View>
            <View style={styles.numberRow}>
              {renderNumpadButton('subtitles', 'Sous-titres', () => api.subtitle(), 'subtitle')}
              {renderNumberButton(0)}
              {renderNumpadButton('audiotrack', 'Audio', () => api.audio(), 'audio')}
            </View>
          </View>
        </View>

        {/* Navigation curseur */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Navigation</Text>
          <View style={styles.dpadContainer}>
            <View style={styles.dpadRow}>
              <TouchableOpacity
                style={[styles.dpadButton, styles.auxiliaryButton]}
                onPress={() => handleCommand(() => api.home(), 'home')}
                disabled={loading === 'home'}
              >
                <MaterialIcons name="home" size={36} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dpadButton}
                onPress={() => handleCommand(() => api.cursorUp(), 'cursor_up')}
                disabled={loading === 'cursor_up'}
              >
                <MaterialIcons name="keyboard-arrow-up" size={48} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dpadButton, styles.auxiliaryButton]}
                onPress={() => handleCommand(() => api.info(), 'info')}
                disabled={loading === 'info'}
              >
                <MaterialIcons name="info" size={36} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.dpadRow}>
              <TouchableOpacity
                style={styles.dpadButton}
                onPress={() => handleCommand(() => api.cursorLeft(), 'cursor_left')}
                disabled={loading === 'cursor_left'}
              >
                <MaterialIcons name="keyboard-arrow-left" size={48} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dpadButton, styles.dpadCenter]}
                onPress={() => handleCommand(() => api.cursorEnter(), 'cursor_enter')}
                disabled={loading === 'cursor_enter'}
              >
                <MaterialIcons name="check" size={36} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dpadButton}
                onPress={() => handleCommand(() => api.cursorRight(), 'cursor_right')}
                disabled={loading === 'cursor_right'}
              >
                <MaterialIcons name="keyboard-arrow-right" size={48} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.dpadRow}>
              <TouchableOpacity
                style={[styles.dpadButton, styles.auxiliaryButton]}
                onPress={() => handleCommand(() => api.menu(), 'menu')}
                disabled={loading === 'menu'}
              >
                <MaterialIcons name="menu" size={36} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dpadButton}
                onPress={() => handleCommand(() => api.cursorDown(), 'cursor_down')}
                disabled={loading === 'cursor_down'}
              >
                <MaterialIcons name="keyboard-arrow-down" size={48} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dpadButton, styles.auxiliaryButton]}
                onPress={() => handleCommand(() => api.return(), 'return')}
                disabled={loading === 'return'}
              >
                <MaterialIcons name="arrow-back" size={36} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Contrôles de lecture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>▶️ Lecture</Text>
          <View style={styles.playbackRow}>
            <ControlButton
              icon="play-arrow"
              label="Play"
              onPress={() => handleCommand(() => api.play(), 'play')}
              loading={loading === 'play'}
              size="small"
            />
            <ControlButton
              icon="pause"
              label="Pause"
              onPress={() => handleCommand(() => api.pause(), 'pause')}
              loading={loading === 'pause'}
              size="small"
            />
            <ControlButton
              icon="stop"
              label="Stop"
              onPress={() => handleCommand(() => api.stop(), 'stop')}
              loading={loading === 'stop'}
              size="small"
            />
          </View>
          <View style={styles.playbackRow}>
            <ControlButton
              icon="skip-previous"
              label="Préc."
              onPress={() => handleCommand(() => api.previous(), 'previous')}
              loading={loading === 'previous'}
              size="small"
            />
            <ControlButton
              icon="skip-next"
              label="Suiv."
              onPress={() => handleCommand(() => api.next(), 'next')}
              loading={loading === 'next'}
              size="small"
            />
          </View>
          <View style={styles.playbackRow}>
            {renderSmallButton('fast-rewind', 'Retour rapide', () => api.fastReverse(), 'fast_reverse', '#2196F3')}
            {renderSmallButton('fast-forward', 'Avance rapide', () => api.fastForward(), 'fast_forward', '#2196F3')}
          </View>
          <View style={styles.playbackRow}>
            {renderSmallButton('replay-10', '-60s', () => api.rewind60Sec(), 'rewind_60', '#2196F3')}
            {renderSmallButton('replay-10', '-10s', () => api.rewind10Sec(), 'rewind_10', '#2196F3')}
            {renderSmallButton('forward-10', '+10s', () => api.forward10Sec(), 'forward_10', '#2196F3')}
            {renderSmallButton('forward-10', '+60s', () => api.forward60Sec(), 'forward_60', '#2196F3')}
          </View>
        </View>

        {/* Volume */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔊 Volume</Text>
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
          <View style={styles.muteRow}>
            {renderSmallButton('volume-off', 'Muet', () => api.mute(), 'mute', '#FF5722')}
          </View>
        </View>

        {/* Fonctions spéciales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎬 Fonctions spéciales</Text>
          <View style={styles.specialRow}>
            {renderSmallButton('repeat', 'Répéter', () => api.repeat(), 'repeat', '#9C27B0')}
            {renderSmallButton('zoom-in', 'Zoom', () => api.zoom(), 'zoom', '#9C27B0')}
          </View>
          <View style={styles.specialRow}>
            {renderSmallButton('3d-rotation', '3D', () => api.threeD(), '3d', '#9C27B0')}
            {renderSmallButton('video-library', 'R_video', () => api.rVideo(), 'r_video', '#9C27B0')}
            {renderSmallButton('folder', 'Explorer', () => api.explorer(), 'explorer', '#9C27B0')}
            {renderSmallButton('format-list-bulleted', 'Format', () => api.formatScroll(), 'format', '#9C27B0')}
          </View>
          <View style={styles.specialRow}>
            {renderSmallButton('brightness-6', 'Dimmer', () => api.dimmer(), 'dimmer', '#9C27B0')}
            {renderSmallButton('delete', 'Suppr.', () => api.deleteKey(), 'delete', '#9C27B0')}
          </View>
        </View>

        {/* Pagination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📄 Pagination</Text>
          <View style={styles.pageRow}>
            {renderSmallButton('arrow-upward', 'Page ↑', () => api.pageUp(), 'page_up', '#00BCD4')}
            {renderSmallButton('arrow-downward', 'Page ↓', () => api.pageDown(), 'page_down', '#00BCD4')}
          </View>
        </View>

        {/* Boutons de fonction couleur */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 Fonctions couleur</Text>
          <View style={styles.colorRow}>
            {renderSmallButton('circle', 'Rouge', () => api.functionRed(), 'function_red', '#F44336')}
            {renderSmallButton('circle', 'Vert', () => api.functionGreen(), 'function_green', '#2196F3')}
            {renderSmallButton('circle', 'Jaune', () => api.functionYellow(), 'function_yellow', '#FFEB3B')}
            {renderSmallButton('circle', 'Bleu', () => api.functionBlue(), 'function_blue', '#2196F3')}
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
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  powerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  playbackRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  specialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  pageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  smallButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  smallButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  numberPad: {
    alignItems: 'center',
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  numberButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    width: 85,
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  numberButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  numpadButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  dpadContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dpadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dpadButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    width: 85,
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dpadCenter: {
    backgroundColor: '#1976D2',
  },
  auxiliaryButton: {
    marginHorizontal: 8,
  },
  volumeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  muteRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
