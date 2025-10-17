import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { createDeviceFromIP } from '../services/networkDiscovery';
import { addDevice } from '../utils/storage';

type AddDeviceScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddDevice'>;

interface Props {
  navigation: AddDeviceScreenNavigationProp;
}

export default function AddDeviceScreen({ navigation }: Props) {
  const [ipAddress, setIpAddress] = useState('');
  const [port, setPort] = useState('80');
  const [deviceName, setDeviceName] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const validateIP = (ip: string): boolean => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;

    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  };

  const handleAddDevice = async () => {
    if (!ipAddress.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse IP');
      return;
    }

    if (!validateIP(ipAddress)) {
      Alert.alert('Erreur', 'Adresse IP invalide');
      return;
    }

    const portNumber = parseInt(port, 10);
    if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
      Alert.alert('Erreur', 'Port invalide (1-65535)');
      return;
    }

    setLoading(true);
    setDebugInfo(`Tentative de connexion à http://${ipAddress}:${portNumber}/status...`);

    try {
      console.log(`🔍 Tentative de connexion à ${ipAddress}:${portNumber}`);
      const device = await createDeviceFromIP(ipAddress, portNumber);

      if (device) {
        if (deviceName.trim()) {
          device.name = deviceName.trim();
        }
        
        await addDevice(device);
        console.log('✅ Appareil ajouté avec succès');
        Alert.alert(
          'Succès',
          `Appareil ajouté avec succès\n${device.name}`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        console.log('❌ Impossible de se connecter à l\'appareil');
        setDebugInfo('');
        Alert.alert(
          'Connexion impossible',
          `Impossible de se connecter à http://${ipAddress}:${portNumber}\n\n` +
          'Vérifiez que :\n' +
          '• L\'appareil est allumé\n' +
          '• L\'adresse IP est correcte\n' +
          '• L\'appareil est sur le même réseau Wi-Fi\n' +
          `• Le port ${portNumber} est accessible\n` +
          '• L\'endpoint /status existe et répond',
          [
            { text: 'Réessayer', onPress: handleAddDevice },
            { text: 'OK', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout:', error);
      setDebugInfo('');
      Alert.alert(
        'Erreur',
        `Une erreur est survenue :\n${error}\n\nVérifiez votre connexion réseau.`,
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Ajouter un appareil</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="speaker" size={80} color="#2196F3" />
          </View>

          <Text style={styles.label}>Nom de l&apos;appareil (optionnel)</Text>
          <TextInput
            style={styles.input}
            placeholder="R_VOLUTION Salon"
            value={deviceName}
            onChangeText={setDeviceName}
            editable={!loading}
          />

          <Text style={styles.label}>Adresse IP *</Text>
          <TextInput
            style={styles.input}
            placeholder="192.168.1.100"
            value={ipAddress}
            onChangeText={setIpAddress}
            keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={styles.label}>Port</Text>
          <TextInput
            style={styles.input}
            placeholder="80"
            value={port}
            onChangeText={setPort}
            keyboardType="numeric"
            editable={!loading}
          />

          {debugInfo ? (
            <View style={styles.debugBox}>
              <Text style={styles.debugText}>{debugInfo}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.addButton, loading && styles.disabledButton]}
            onPress={handleAddDevice}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="add" size={24} color="#fff" />
                <Text style={styles.addButtonText}>Ajouter l&apos;appareil</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <MaterialIcons name="info" size={20} color="#2196F3" />
            <Text style={styles.infoText}>
              L&apos;application va tenter de se connecter à http://{ipAddress || '...'}{port ? `:${port}` : ':80'}/status
              {'\n\n'}
              Assurez-vous que votre appareil R_VOLUTION répond à cette URL.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 12,
    lineHeight: 20,
  },
  debugBox: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  debugText: {
    fontSize: 12,
    color: '#E65100',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});