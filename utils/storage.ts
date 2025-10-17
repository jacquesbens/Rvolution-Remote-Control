import AsyncStorage from '@react-native-async-storage/async-storage';
import { RvolutionDevice } from '../types';

const DEVICES_KEY = '@rvolution_devices';

export const saveDevices = async (devices: RvolutionDevice[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
  } catch (error) {
    console.error('Error saving devices:', error);
    throw error;
  }
};

export const loadDevices = async (): Promise<RvolutionDevice[]> => {
  try {
    const devicesJson = await AsyncStorage.getItem(DEVICES_KEY);
    return devicesJson ? JSON.parse(devicesJson) : [];
  } catch (error) {
    console.error('Error loading devices:', error);
    return [];
  }
};

export const addDevice = async (device: RvolutionDevice): Promise<void> => {
  try {
    const devices = await loadDevices();
    const existingIndex = devices.findIndex(d => d.ipAddress === device.ipAddress);
    
    if (existingIndex >= 0) {
      devices[existingIndex] = device;
    } else {
      devices.push(device);
    }
    
    await saveDevices(devices);
  } catch (error) {
    console.error('Error adding device:', error);
    throw error;
  }
};

export const removeDevice = async (deviceId: string): Promise<void> => {
  try {
    const devices = await loadDevices();
    const filteredDevices = devices.filter(d => d.id !== deviceId);
    await saveDevices(filteredDevices);
  } catch (error) {
    console.error('Error removing device:', error);
    throw error;
  }
};