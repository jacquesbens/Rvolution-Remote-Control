import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RvolutionDevice } from '../types';

interface DeviceCardProps {
  device: RvolutionDevice;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DeviceCard({ device, onPress, onEdit, onDelete }: DeviceCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <MaterialIcons 
          name="speaker" 
          size={40} 
          color={device.isOnline ? '#2196F3' : '#9E9E9E'} 
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={styles.deviceIP}>{device.ipAddress}:{device.port}</Text>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusDot,
            { backgroundColor: device.isOnline ? '#2196F3' : '#9E9E9E' }
          ]} />
          <Text style={styles.statusText}>
            {device.isOnline ? 'En ligne' : 'Hors ligne'}
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <MaterialIcons name="edit" size={24} color="#2196F3" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <MaterialIcons name="delete" size={24} color="#F44336" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  deviceIP: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
});
