import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ListRenderItem, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Snake: undefined;
  Tetris: undefined;
  Memorie: undefined;
  Pong: undefined;
  Login: undefined;
};

interface Game {
  id: keyof RootStackParamList;
  title: string;
}

const GamesGridScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const games: Game[] = [
    { id: 'Snake', title: 'Snake' },
    { id: 'Memorie', title: 'Memorie' },
  ];

  //function deconnection
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken')
      // rediriger sur la page d'accueil
      navigation.navigate('Login')
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se déconnecter')
    }
  }


  const handlePress = (gameId: keyof RootStackParamList) => {
    navigation.navigate(gameId);
  };

  const renderGameItem: ListRenderItem<Game> = ({ item }) => (
    <TouchableOpacity style={styles.gameItem} onPress={() => handlePress(item.id)}>
      <Text style={styles.gameTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // Deux colonnes par ligne
      />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  gameItem: {
    flex: 1,
    margin: 10,
    marginTop:40,
    padding: 20,
    backgroundColor: 'green',
    alignItems: 'center',
    borderRadius: 10,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ff4d4d',
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GamesGridScreen;
