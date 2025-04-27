import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import * as SecureStore from "expo-secure-store";
import { getErrorMessage } from "../utils/errorsHandler";
import AsyncStorage from '@react-native-async-storage/async-storage';


type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenProps = {
    setIsAuthenticated: (value: boolean) => void;
  };

const LoginScreen = ({ setIsAuthenticated }: LoginScreenProps) =>  {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log('Attempting login...');
      const response = await fetch("http://localhost:3000/my_alarm/v1/users/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        console.log('Login failed with status', response.status);
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login success, user data:', data);

      await AsyncStorage.setItem('user', JSON.stringify({
        id: data.id,
        username: data.username,
        group: data.group,
    }));
    

      console.log('User saved in SecureStore, setting isAuthenticated to true...');
      setIsAuthenticated(true);

    } catch (error) {
      console.log('Login error:', error);
      Alert.alert("Error", getErrorMessage(error) || "Login failed");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>


        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#1F1B1B", justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { color: "#FFF", fontSize: 32, fontWeight: "bold", marginBottom: 40 },
    input: { width: '90%', backgroundColor: "#2A2A2A", color: "#FFF", padding: 15, borderRadius: 10, marginBottom: 20 },
    button: { backgroundColor: "#4C7DA5", padding: 15, borderRadius: 10, width: '90%', alignItems: 'center' },
    buttonText: { color: "#FFF", fontSize: 18, fontWeight: 'bold' },
    link: { color: "#4C7DA5", marginTop: 20, fontSize: 16 },
  });

export default LoginScreen;
