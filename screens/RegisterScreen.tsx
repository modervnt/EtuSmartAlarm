import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { getErrorMessage } from "../utils/errorsHandler";

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [group, setGroup] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:3000/my_alarm/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            username: username, 
            email: email, 
            password: password, 
            group:Number(group) 
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      Alert.alert("Success", "Registration completed");
      navigation.navigate('Login');
      
    } catch (error) {
      Alert.alert("Error", getErrorMessage(error) || "Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput 
        placeholder="Username" 
        placeholderTextColor="#888"
        style={styles.input} 
        value={username}
        onChangeText={setUsername}
      />
      <TextInput 
        placeholder="Email" 
        placeholderTextColor="#888"
        style={styles.input} 
        value={email}
        onChangeText={setEmail}
      />
      <TextInput 
        placeholder="Password" 
        placeholderTextColor="#888"
        secureTextEntry
        style={styles.input} 
        value={password}
        onChangeText={setPassword}
      />
      <TextInput 
        placeholder="Group" 
        placeholderTextColor="#888"
        style={styles.input} 
        value={group}
        onChangeText={setGroup}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1F1B1B", justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { color: "#FFF", fontSize: 32, fontWeight: "bold", marginBottom: 40 },
  input: { width: '100%', backgroundColor: "#2A2A2A", color: "#FFF", padding: 15, borderRadius: 10, marginBottom: 20 },
  button: { backgroundColor: "#4C7DA5", padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: 'bold' },
  link: { color: "#4C7DA5", marginTop: 20, fontSize: 16 },
});

export default RegisterScreen;
