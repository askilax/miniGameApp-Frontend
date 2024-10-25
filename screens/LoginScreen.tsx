import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,KeyboardAvoidingView, Platform  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface LoginScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [loginEmailOrUsername, setLoginEmailOrUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerUsername, setRegisterUsername] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response = await axios.post<{ token: string }>('http://192.168.1.15:5000/users/login', {
        emailOrUsername: loginEmailOrUsername,
        password: loginPassword,
      });

      if (response.status === 200) {
        await AsyncStorage.setItem('userToken', response.data.token);
        navigation.navigate('GamesGrid');
      } else {
        alert('Échec de la connexion');
      }
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      alert('Erreur lors de la connexion');
    }
  };

  // Fonction d'inscription
  const handleRegister = async () => {
    try {
      const response = await axios.post('http://192.168.1.15:5000/users/register', {
        email: registerEmail,
        username: registerUsername,
        password: registerPassword,
      });

      if (response.status === 201) {
        alert('Inscription réussie, veuillez vous connecter.');
        // Vider les champs après l'inscription
        setRegisterEmail('');
        setRegisterUsername('');
        setRegisterPassword('');
      } else {
        alert("Échec de l'inscription");
      }
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> 
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email ou Username"
        value={loginEmailOrUsername}
        onChangeText={setLoginEmailOrUsername}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={loginPassword}
        onChangeText={setLoginPassword}
        secureTextEntry
      />
      <Button title="Se connecter" onPress={handleLogin} />

      <Text style={styles.title}>Inscription</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={registerEmail}
        onChangeText={setRegisterEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={registerUsername}
        onChangeText={setRegisterUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={registerPassword}
        onChangeText={setRegisterPassword}
        secureTextEntry
      />
      <Button title="S'inscrire" onPress={handleRegister} />
    </KeyboardAvoidingView>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default LoginScreen;