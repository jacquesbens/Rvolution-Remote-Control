import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { LanguageProvider } from './contexts/LanguageContext';
import DevicesScreen from './screens/DevicesScreen';
import AddDeviceScreen from './screens/AddDeviceScreen';
import EditDeviceScreen from './screens/EditDeviceScreen';
import PlayerControlScreen from './screens/PlayerControlScreen';
import { RvolutionDevice } from './types';
import { loadDevices } from './utils/storage';
import type { NavigationContainerRef } from '@react-navigation/native';

export type RootStackParamList = {
  Devices: undefined;
  AddDevice: undefined;
  EditDevice: { device: RvolutionDevice };
  PlayerControl: { device: RvolutionDevice };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    const checkDevices = async () => {
      try {
        const devices = await loadDevices();
        
        if (devices.length === 1) {
          // Si un seul appareil est enregistré, naviguer vers la télécommande
          setTimeout(() => {
            navigationRef.current?.navigate('PlayerControl', { device: devices[0] });
          }, 0);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des appareils:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkDevices();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator 
            screenOptions={{ headerShown: false }}
            id={undefined}
          >
            <Stack.Screen name="Devices" component={DevicesScreen} />
            <Stack.Screen name="AddDevice" component={AddDeviceScreen} />
            <Stack.Screen name="EditDevice" component={EditDeviceScreen} />
            <Stack.Screen name="PlayerControl" component={PlayerControlScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
