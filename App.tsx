import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Inter_300Light, Inter_400Regular } from '@expo-google-fonts/inter';

export default function App() {
  const [theme, setTheme] = useState('light');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    Inter_300Light,
    Inter_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // Fade in animation when component mounts
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [fontsLoaded]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a2e' }
    ]}>
      <Animated.View style={[
        styles.content,
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <Image 
          source={require('./assets/images/icon.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
        
        <Text style={[
          styles.title,
          { 
            color: theme === 'light' ? '#333' : '#fff',
            fontFamily: 'PlayfairDisplay_400Regular',
            fontWeight: '300'
          }
        ]}>
          welcome to kiki
        </Text>
        
        <Text style={[
          styles.subtitle,
          { 
            color: theme === 'light' ? '#666' : '#ccc',
            fontFamily: 'Inter_300Light'
          }
        ]}>
          tell the ai what to make!
        </Text>

        <View style={styles.reactContainer}>
          <Text style={[
            styles.poweredBy,
            { 
              color: theme === 'light' ? '#666' : '#ccc',
              fontFamily: 'Inter_300Light'
            }
          ]}>
            powered by
          </Text>
          <Image 
            source={require('./assets/images/react-logo.png')} 
            style={styles.reactLogo} 
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      <TouchableOpacity 
        style={[
          styles.themeToggle,
          { backgroundColor: theme === 'light' ? '#333' : '#f0f8ff' }
        ]} 
        onPress={toggleTheme}
      >
        <Text style={{ 
          color: theme === 'light' ? '#fff' : '#333',
          fontWeight: 'bold'
        }}>
          {theme === 'light' ? '🌙' : '☀️'}
        </Text>
      </TouchableOpacity>
      
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  reactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  poweredBy: {
    fontSize: 16,
    marginRight: 6,
  },
  reactLogo: {
    width: 24,
    height: 24,
  },
  themeToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
