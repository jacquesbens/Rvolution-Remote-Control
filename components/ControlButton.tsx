import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface ControlButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'large';
}

export default function ControlButton({ 
  icon, 
  label, 
  onPress, 
  disabled = false,
  loading = false,
  size = 'large'
}: ControlButtonProps) {
  const isLarge = size === 'large';
  
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isLarge ? styles.largeButton : styles.smallButton,
        disabled && styles.disabledButton,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size={isLarge ? 'large' : 'small'} />
      ) : (
        <>
          <MaterialIcons 
            name={icon} 
            size={isLarge ? 48 : 32} 
            color="#fff" 
          />
          <Text style={[
            styles.label,
            isLarge ? styles.largeLabel : styles.smallLabel
          ]}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  largeButton: {
    width: 100,
    height: 100,
    margin: 8,
  },
  smallButton: {
    width: 85,
    height: 85,
    margin: 6,
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 4,
  },
  largeLabel: {
    fontSize: 14,
  },
  smallLabel: {
    fontSize: 12,
  },
});
