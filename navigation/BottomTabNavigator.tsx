import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import DetailsScreen from "../screens/SettingScreen";
import AlarmScreen from "../screens/AlarmScreen";
import AwakeningStatisticsScreen from "../screens/AwakeningStatisticsScreen";
import QuizSummaryScreen from "../screens/QuizSummaryScreen";
import { createStackNavigator } from "@react-navigation/stack";
import AlarmConfig from "../screens/AlarmConfig";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AlarmStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AlarmScreen" component={AlarmScreen}/>
      <Stack.Screen name="AlarmConfig" component={AlarmConfig}/>
    </Stack.Navigator>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "Alarm") {
            iconName = focused ? "alarm" : "alarm-outline";
          }else if (route.name === "Awakening statistics") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          }else if (route.name === "Quiz summary") {
            iconName = focused ? "reader" : "reader-outline";
          }

          return iconName ? <Ionicons name={iconName} size={size} color={color} /> : null;
        },
        tabBarActiveTintColor: "#F9F2F2",
        tabBarInactiveTintColor: "gray",
        tabBarStyle:{
            backgroundColor: "#3D3636",
        },
      })}
    >
      <Tab.Screen name="Alarm" component={AlarmStack} options={{ title: "Alarms", headerShown: false }} />
      <Tab.Screen name= "Awakening statistics" component={AwakeningStatisticsScreen} options={{ title: "Awakening Stats", headerShown: false}}/>
      <Tab.Screen name="Quiz summary" component={QuizSummaryScreen} options={{title: "Quiz summary", headerShown: false}}/>
      <Tab.Screen name="Settings" component={DetailsScreen} options={{ title: "Settings", headerShown: false }} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

/*
    En realite le nom des routes est define dans Tab.Screen.
*/ 