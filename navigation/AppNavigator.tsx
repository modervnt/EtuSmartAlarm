import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./BottomTabNavigator";
import DetailsScreen from "../screens/SettingScreen";

const Stack = createStackNavigator();

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
                <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Details'}}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;