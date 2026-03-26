import React, { useState, useEffect } from 'react';
import { View, Text, Button, PermissionsAndroid, StyleSheet } from 'react-native';
import { SQLite } from 'expo-sqlite';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';

const db = SQLite.openDatabase('mycellium.db');

const App = () => {
  const [location, setLocation] = useState(null);
  const [deals, setDeals] = useState([]);
  const [signalStrength, setSignalStrength] = useState(null);

  useEffect(() => {
    getLocation();
    fetchDeals();
  }, []);

  const getLocation = async () => {
    const { status } = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    } else {
      console.log('Location permission not granted');
    }
  };

  const fetchDeals = async () => {
    // Fetch deals from Flask Backend API
    const response = await fetch('http://your-flask-backend-url/api/deals');
    const json = await response.json();
    setDeals(json);
  };

  const checkSignalStrength = async () => {
    // Use a library or method to check signal strength
    // This is a mockup for demonstration
    const strength = Math.floor(Math.random() * 100);
    setSignalStrength(strength);
  };

  const playVoiceFeature = async () => {
    // Use Text-to-Speech or similar
    const { Sound } = await Audio.Sound.createAsync(require('./audio/voice.mp3'));
    await Sound.playAsync();
  };

  const saveUserInfo = (username) => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, username TEXT);');
      tx.executeSql('INSERT INTO users (username) VALUES (?);', [username]);
    });
  };

  return (
    <View style={styles.container}>
      <Text>User Location: {JSON.stringify(location)}</Text>
      <Text>Signal Strength: {signalStrength}</Text>
      <Button title="Check Signal Strength" onPress={checkSignalStrength} />
      <Text>Best Deals:</Text>
      {deals.map((deal, index) => (
        <Text key={index}>{deal.title} - {deal.price}</Text>
      ))}
      <Button title="Play Voice" onPress={playVoiceFeature} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;