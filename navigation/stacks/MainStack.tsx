import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from '../BottomTabNavigator';
import AlarmConfig from '../../screens/AlarmConfig';
import AlarmScreen from '../../screens/AlarmScreen';
import DetailsScreen from '../../screens/SettingScreen';

const Stack = createStackNavigator();

const MainStack = ({ setIsAuthenticated }: { setIsAuthenticated: (auth: boolean) => void }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={BottomTabNavigator} />
      <Stack.Screen name="AlarmConfig" component={AlarmConfig} />
      <Stack.Screen name="Home" component={AlarmScreen} />
      <Stack.Screen name="Setting">
        {() => <DetailsScreen setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default MainStack;
