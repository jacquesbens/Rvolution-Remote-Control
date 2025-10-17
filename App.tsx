import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DevicesScreen from './screens/DevicesScreen';
import AddDeviceScreen from './screens/AddDeviceScreen';
import PlayerControlScreen from './screens/PlayerControlScreen';
import { RvolutionDevice } from './types';

export type RootStackParamList = {
  Devices: undefined;
  AddDevice: undefined;
  PlayerControl: { device: RvolutionDevice };
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Devices" component={DevicesScreen} />
          <Stack.Screen name="AddDevice" component={AddDeviceScreen} />
          <Stack.Screen name="PlayerControl" component={PlayerControlScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}