import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./BottomTabNavigator";
import DetailsScreen from "../screens/SettingScreen";
import AlarmConfig from "../screens/AlarmConfig";
import { RootStackParamList } from "../types";
import AlarmScreen from "../screens/AlarmScreen";

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Tabs">
                {/* Navbar principale */}
                <Stack.Screen
                    name="Tabs" //?????
                    component={BottomTabNavigator}
                    options={{ headerShown: false }}
                />
                {/* Écran secondaire */}
                <Stack.Screen name="AlarmConfig" component={AlarmConfig} options={{ headerShown: false }} />
                <Stack.Screen name="Home" component={AlarmScreen} options={{ headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;