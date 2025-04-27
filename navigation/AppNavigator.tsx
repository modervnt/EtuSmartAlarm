import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';

import LoginScreen from '../screens/loginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BottomTabNavigator from './BottomTabNavigator';
import AlarmConfig from '../screens/AlarmConfig';
import AlarmScreen from '../screens/AlarmScreen';
import DetailsScreen from '../screens/SettingScreen';

const Stack = createStackNavigator();

const AuthStack = ({ setIsAuthenticated }: { setIsAuthenticated: (value: boolean) => void }) => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {() => <LoginScreen setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
  

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Tabs" component={BottomTabNavigator} />
    <Stack.Screen name="AlarmConfig" component={AlarmConfig} />
    <Stack.Screen name="Home" component={AlarmScreen} />
    <Stack.Screen name="Setting" component={DetailsScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
    useEffect(() => {
      const checkAuth = async () => {
        try {
          console.log('Checking if user is authenticated...');
          const user = await SecureStore.getItemAsync('user');
          console.log('SecureStore user:', user);
          setIsAuthenticated(!!user);
        } catch (error) {
          console.log('Error checking auth:', error);
          setIsAuthenticated(false);
        }
      };
  
      checkAuth();
    }, []);
  
    useEffect(() => {
      console.log('isAuthenticated changed:', isAuthenticated);
    }, [isAuthenticated]);
  
    if (isAuthenticated === null) {
      console.log('Waiting for auth check...');
      return null;
    }
  
    console.log('Rendering AppNavigator with isAuthenticated =', isAuthenticated);
  
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name="Main">
              {() => <MainStack />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Auth">
              {() => <AuthStack setIsAuthenticated={setIsAuthenticated} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  };
  export default AppNavigator;
