import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>R</Text>
      </View>
      <Text style={styles.title}>R_VOLUTION</Text>
      <Text style={styles.subtitle}>Remote Control</Text>
      <ActivityIndicator size="large" color="#fff" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});