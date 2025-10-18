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
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { createDeviceFromIP } from '../services/networkDiscovery';
import { loadDevices, saveDevices } from '../utils/storage';
import { useLanguage } from '../contexts/LanguageContext';

type EditDeviceScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditDevice'>;
type EditDeviceScreenRouteProp = RouteProp<RootStackParamList, 'EditDevice'>;

interface Props {
  navigation: EditDeviceScreenNavigationProp;
  route: EditDeviceScreenRouteProp;
}

export default function EditDeviceScreen({ navigation, route }: Props) {
  const { t } = useLanguage();
  const { device } = route.params;
  const [deviceName, setDeviceName] = useState(device.name);
  const [ipAddress, setIpAddress] = useState(device.ipAddress);
  const [loading, setLoading] = useState(false);

  const validateIP = (ip: string): boolean => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;

    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  };

  const handleSaveDevice = async () => {
    if (!deviceName.trim()) {
      Alert.alert(t.error, t.enterDeviceName);
      return;
    }

    if (!ipAddress.trim()) {
      Alert.alert(t.error, t.enterIPAddressEdit);
      return;
    }

    if (!validateIP(ipAddress)) {
      Alert.alert(t.error, t.invalidIPAddress);
      return;
    }

    setLoading(true);

    try {
      // Si l'IP a changé, vérifier la connexion
      if (ipAddress !== device.ipAddress) {
        console.log(`🔍 Vérification de la nouvelle adresse ${ipAddress}...`);
        const verifiedDevice = await createDeviceFromIP(ipAddress, device.port);

        if (!verifiedDevice) {
          Alert.alert(
            t.connectionFailed,
            `${t.connectionFailed} http://${ipAddress}:${device.port}\n\n${t.editInfoMessage}`,
            [
              { text: t.cancel, style: 'cancel', onPress: () => setLoading(false) },
              {
                text: t.saveAnyway,
                onPress: async () => {
                  await updateDevice();
                }
              }
            ]
          );
          return;
        }
      }

      await updateDevice();
    } catch (error) {
      console.error('❌ Erreur lors de la modification:', error);
      setLoading(false);
      Alert.alert(
        t.error,
        `${t.error}:\n${error}`,
        [{ text: t.ok }]
      );
    }
  };

  const updateDevice = async () => {
    try {
      const devices = await loadDevices();
      const deviceIndex = devices.findIndex(d => d.id === device.id);

      if (deviceIndex >= 0) {
        // Mettre à jour l'appareil
        devices[deviceIndex] = {
          ...devices[deviceIndex],
          name: deviceName.trim(),
          ipAddress: ipAddress.trim(),
          id: `${ipAddress.trim()}:${device.port}`,
        };

        await saveDevices(devices);
        console.log('✅ Appareil modifié avec succès');
        
        Alert.alert(
          t.success,
          t.deviceUpdatedSuccess,
          [{ text: t.ok, onPress: () => navigation.goBack() }]
        );
      } else {
        throw new Error('Appareil non trouvé');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      Alert.alert(t.error, t.error);
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
          <Text style={styles.title}>{t.editDevice}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="edit" size={80} color="#2196F3" />
          </View>

          <Text style={styles.label}>{t.deviceNameRequired}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.deviceNamePlaceholder}
            value={deviceName}
            onChangeText={setDeviceName}
            editable={!loading}
          />

          <Text style={styles.label}>{t.ipAddress}</Text>
          <TextInput
            style={styles.input}
            placeholder={t.ipAddressPlaceholder}
            value={ipAddress}
            onChangeText={setIpAddress}
            keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSaveDevice}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="save" size={24} color="#fff" />
                <Text style={styles.saveButtonText}>{t.saveChanges}</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <MaterialIcons name="info" size={20} color="#2196F3" />
            <Text style={styles.infoText}>
              {t.editInfoMessage}
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
  saveButton: {
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
  saveButtonText: {
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
});