import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GamesGridScreen from './screens/GamesGridScreen';
import SnakeGame from './screens/SnakeGame';
import  Memorie from './screens/Memorie';
import LoginScreen from './screens/LoginScreen';
const jwtDecode = require('jwt-decode');

const Stack = createNativeStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decodedToken: any = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            // Le token est expiré, on le supprime et on redirige vers la page Login
            await AsyncStorage.removeItem('userToken');
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkTokenExpiration();
  }, []);

  if (loading) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? 'GamesGrid' : 'Login'} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="GamesGrid" component={GamesGridScreen}/>
        <Stack.Screen name="Snake" component={SnakeGame}/>
        <Stack.Screen name="Memorie" component={Memorie}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
