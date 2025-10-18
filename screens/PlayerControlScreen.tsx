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
import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import ControlButton from '../components/ControlButton';
import { RvolutionPlayerAPI } from '../services/playerAPI';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();

  const handleCommand = async (
    command: () => Promise<boolean>,
    commandName: string
  ) => {
    // Déclencher le retour haptique
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setLoading(commandName);
    try {
      console.log(`🎮 Exécution de la commande: ${commandName}`);
      const success = await command();
      if (!success) {
        Alert.alert(t.error, `${t.commandError}: ${commandName}`);
      } else {
        console.log(`✅ Commande ${commandName} exécutée avec succès`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de l\\'exécution de ${commandName}:`, error);
      Alert.alert(t.error, t.commandError);
    } finally {
      setLoading(null);
    }
  };

  const handleVolumeUp = () => {
    handleCommand(() => api.volumeUp(), 'volume_up');
  };

  const handleVolumeDown = () => {
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

  const renderDpadButton = (
    icon: keyof typeof MaterialIcons.glyphMap,
    label: string | null,
    command: () => Promise<boolean>,
    commandName: string,
    iconSize: number = 36
  ) => (
    <TouchableOpacity
      style={[styles.dpadButtonSquare, styles.auxiliaryButton]}
      onPress={() => handleCommand(command, commandName)}
      disabled={loading === commandName}
    >
      <MaterialIcons name={icon} size={iconSize} color="#fff" />
      {label && <Text style={styles.dpadButtonText}>{label}</Text>}
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
          onPress={() => navigation.navigate('Devices')}
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
          <Text style={styles.sectionTitle}>⚡ {t.powerSection}</Text>
          <View style={styles.powerRow}>
            {renderSmallButton('power-settings-new', t.power, () => api.powerToggle(), 'power_toggle', '#F44336')}
            {renderSmallButton('power', t.powerOn, () => api.powerOn(), 'power_on', '#2196F3')}
            {renderSmallButton('power-off', t.powerOff, () => api.powerOff(), 'power_off', '#9E9E9E')}
          </View>
        </View>

        {/* Pavé numérique */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔢 {t.numpad}</Text>
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
              {renderNumpadButton('subtitles', t.subtitle, () => api.subtitle(), 'subtitle')}
              {renderNumberButton(0)}
              {renderNumpadButton('audiotrack', t.audio, () => api.audio(), 'audio')}
            </View>
          </View>
        </View>

        {/* Navigation curseur */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 {t.navigation}</Text>
          <View style={styles.dpadContainer}>
            <View style={styles.dpadRow}>
              {renderDpadButton('home', null, () => api.home(), 'home')}
              <TouchableOpacity
                style={styles.dpadButton}
                onPress={() => handleCommand(() => api.cursorUp(), 'cursor_up')}
                disabled={loading === 'cursor_up'}
              >
                <MaterialIcons name="keyboard-arrow-up" size={48} color="#fff" />
              </TouchableOpacity>
              <View style={[styles.dpadButton, styles.auxiliaryButton, { opacity: 0 }]} />
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
              {renderDpadButton('menu', t.menu, () => api.menu(), 'menu')}
              <TouchableOpacity
                style={styles.dpadButton}
                onPress={() => handleCommand(() => api.cursorDown(), 'cursor_down')}
                disabled={loading === 'cursor_down'}
              >
                <MaterialIcons name="keyboard-arrow-down" size={48} color="#fff" />
              </TouchableOpacity>
              {renderDpadButton('arrow-back', null, () => api.return(), 'return')}
            </View>
          </View>
        </View>

        {/* Contrôles de lecture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>▶️ {t.playback}</Text>
          <View style={styles.playbackRow}>
            <ControlButton
              icon="play-arrow"
              label={t.play}
              onPress={() => handleCommand(() => api.play(), 'play')}
              loading={loading === 'play'}
              size="small"
            />
            <ControlButton
              icon="pause"
              label={t.pause}
              onPress={() => handleCommand(() => api.pause(), 'pause')}
              loading={loading === 'pause'}
              size="small"
            />
            <ControlButton
              icon="stop"
              label={t.stop}
              onPress={() => handleCommand(() => api.stop(), 'stop')}
              loading={loading === 'stop'}
              size="small"
            />
          </View>
          <View style={styles.playbackRow}>
            <ControlButton
              icon="skip-previous"
              label={t.previous}
              onPress={() => handleCommand(() => api.previous(), 'previous')}
              loading={loading === 'previous'}
              size="small"
            />
            <ControlButton
              icon="skip-next"
              label={t.next}
              onPress={() => handleCommand(() => api.next(), 'next')}
              loading={loading === 'next'}
              size="small"
            />
          </View>
          <View style={styles.playbackRow}>
            {renderSmallButton('fast-rewind', t.fastRewind, () => api.fastReverse(), 'fast_reverse', '#2196F3')}
            {renderSmallButton('fast-forward', t.fastForward, () => api.fastForward(), 'fast_forward', '#2196F3')}
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
          <Text style={styles.sectionTitle}>🔊 {t.volume}</Text>
          <View style={styles.volumeRow}>
            <TouchableOpacity
              style={styles.volumeButtonLarge}
              onPress={handleVolumeDown}
              disabled={loading === 'volume_down'}
            >
              <MaterialIcons name="volume-down" size={32} color="#fff" />
              <Text style={styles.smallButtonText}>{t.volume} -</Text>
            </TouchableOpacity>
            
            {renderSmallButton('volume-off', t.mute, () => api.mute(), 'mute', '#2196F3')}

            <TouchableOpacity
              style={styles.volumeButtonLarge}
              onPress={handleVolumeUp}
              disabled={loading === 'volume_up'}
            >
              <MaterialIcons name="volume-up" size={32} color="#fff" />
              <Text style={styles.smallButtonText}>{t.volume} +</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fonctions spéciales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎬 {t.specialFunctions}</Text>
          <View style={styles.specialRow}>
            {renderSmallButton('info', t.info, () => api.info(), 'info', '#2196F3')}
            {renderSmallButton('repeat', t.repeat, () => api.repeat(), 'repeat', '#2196F3')}
            {renderSmallButton('zoom-in', t.zoom, () => api.zoom(), 'zoom', '#2196F3')}
          </View>
          <View style={styles.specialRow}>
            {renderSmallButton('3d-rotation', t.threeD, () => api.threeD(), '3d', '#2196F3')}
            {renderSmallButton('video-library', t.rVideo, () => api.rVideo(), 'r_video', '#2196F3')}
            {renderSmallButton('folder', t.explorer, () => api.explorer(), 'explorer', '#2196F3')}
            {renderSmallButton('format-list-bulleted', t.format, () => api.formatScroll(), 'format', '#2196F3')}
          </View>
          <View style={styles.specialRow}>
            {renderSmallButton('brightness-6', t.dimmer, () => api.dimmer(), 'dimmer', '#2196F3')}
            {renderSmallButton('delete', t.deleteKey, () => api.deleteKey(), 'delete', '#2196F3')}
          </View>
        </View>

        {/* Pagination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📄 {t.pagination}</Text>
          <View style={styles.pageRow}>
            {renderSmallButton('arrow-upward', t.pageUp, () => api.pageUp(), 'page_up', '#2196F3')}
            {renderSmallButton('arrow-downward', t.pageDown, () => api.pageDown(), 'page_down', '#2196F3')}
          </View>
        </View>

        {/* Boutons de fonction couleur */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 {t.colorFunctions}</Text>
          <View style={styles.colorRow}>
            {renderSmallButton('circle', t.red, () => api.functionRed(), 'function_red', '#F44336')}
            {renderSmallButton('circle', t.green, () => api.functionGreen(), 'function_green', '#4CAF50')}
            {renderSmallButton('circle', t.yellow, () => api.functionYellow(), 'function_yellow', '#FFEB3B')}
            {renderSmallButton('circle', t.blue, () => api.functionBlue(), 'function_blue', '#2196F3')}
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
    borderRadius: 42.5, // 85 / 2 pour un cercle parfait
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
  dpadButtonSquare: {
    backgroundColor: '#2196F3',
    borderRadius: 12, // Coins arrondis mais reste carré
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
  volumeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  volumeButtonLarge: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
  dpadButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
});
