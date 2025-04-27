import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Setting'>

interface User {
  id: number;
  username: string;
  group: number;
}

const DetailsScreen =  () => {
  const navigation = useNavigation<SettingScreenNavigationProp>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
if (userData) {
  const user = JSON.parse(userData);
  console.log(user);
}

        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');

      //await SecureStore.deleteItemAsync('user');

navigation.reset({
  index: 0,
  routes: [{ name: 'Auth' }],
});

    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Error", "Failed to logout");
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <AntDesign name="user" size={40} color="#4C7DA5" />
          </View>
          <Text style={styles.profileName}>{user?.username || "Guest"}</Text>
          <Text style={styles.profileEmail}>Group: {user?.group || "Unknown"}</Text>
        </View>

        {/* Settings Options */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionIconContainer}>
              <AntDesign name="user" size={24} color="#4C7DA5" />
            </View>
            <Text style={styles.optionText}>Profile Information</Text>
            <MaterialIcons name="chevron-right" size={24} color="#777" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionIconContainer}>
              <Entypo name="language" size={24} color="#4C7DA5" />
            </View>
            <Text style={styles.optionText}>Language</Text>
            <Text style={styles.optionValue}>English</Text>
            <MaterialIcons name="chevron-right" size={24} color="#777" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionIconContainer}>
              <FontAwesome name="question-circle-o" size={24} color="#4C7DA5" />
            </View>
            <Text style={styles.optionText}>Help Center</Text>
            <MaterialIcons name="chevron-right" size={24} color="#777" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionIconContainer}>
              <AntDesign name="mail" size={24} color="#4C7DA5" />
            </View>
            <Text style={styles.optionText}>Contact Support</Text>
            <MaterialIcons name="chevron-right" size={24} color="#777" />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>More</Text>
          
          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionIconContainer}>
              <Ionicons name="document-text-outline" size={24} color="#4C7DA5" />
            </View>
            <Text style={styles.optionText}>Terms & Conditions</Text>
            <MaterialIcons name="chevron-right" size={24} color="#777" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionIconContainer}>
              <MaterialIcons name="privacy-tip" size={24} color="#4C7DA5" />
            </View>
            <Text style={styles.optionText}>Privacy Policy</Text>
            <MaterialIcons name="chevron-right" size={24} color="#777" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
    backgroundColor: "#1F1B1B",
  },
  container: {
    flex: 1,
    backgroundColor: "#1F1B1B",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    backgroundColor: '#3D3636',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#999',
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#777',
    marginBottom: 15,
    fontWeight: '600',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  optionIconContainer: {
    backgroundColor: '#3D3636',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    color: 'white',
  },
  optionValue: {
    fontSize: 16,
    color: '#777',
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: '#4C7DA5',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DetailsScreen;