// AlarmScreen.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Modal,
  FlatList,
  Pressable,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import { Alarm } from "../data/alarm";
import Entypo from "@expo/vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Haptics from "expo-haptics";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const AlarmScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: 1,
      time: "07:00",
      isActive: true,
      testSubject: "Probability",
      workingDay: [1, 1, 1, 1, 1, 1, 1],
      smartWakeUp: true,
    },
    {
      id: 2,
      time: "08:30",
      isActive: true,
      testSubject: "Graph Theory",
      workingDay: [1, 0, 1, 1, 0, 1, 1],
      smartWakeUp: false,
    },
  ]);

  const [nextAlarm, setNextAlarm] = useState<string>("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState<Alarm | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const emptyAlarm: Alarm = {
    id: 0,
    time: "07:00",
    isActive: false,
    testSubject: "",
    workingDay: [0, 0, 0, 0, 0, 0, 0],
    smartWakeUp: true,
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();

    calculateNextAlarm();
  }, [alarms]);

  const calculateNextAlarm = () => {
    setNextAlarm("7h 15min (Light phase detected)");
  };

  const toggleSwitch = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
      )
    );
  };

  const toggleSmartWakeUp = (id: number) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, smartWakeUp: !alarm.smartWakeUp } : alarm
      )
    );
  };

  const handleMenuPress = (alarm: Alarm) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedAlarm(alarm);
    setIsMenuVisible(true);
  };

  const handleDelete = (id: number) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
    setIsMenuVisible(false);
  };

  const dayInitials = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Your exams are coming 🫵🏾!</Text>

          <View style={styles.motivationCard}>
            <Text style={styles.motivationTitle}>Quote of the day:</Text>
            <Text style={styles.motivationText}>
              "Perseverance turns failure into success"
            </Text>
          </View>

          <View style={styles.nextAlarmContainer}>
            <Text style={styles.nextAlarmText}>Next alarm:</Text>
            <Text style={styles.nextAlarmTime}>{nextAlarm}</Text>
          </View>
        </View>

        <FlatList
          data={alarms}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.alarmCard}>
              <View style={styles.alarmLeft}>
                <Text style={styles.alarmTime}>{item.time}</Text>
                <Text style={styles.alarmSubject}>Quiz: {item.testSubject}</Text>
                <View style={styles.daysContainer}>
                  {item.workingDay.map((day, index) => (
                    <Text
                      key={index}
                      style={[
                        styles.dayText,
                        day ? styles.activeDay : styles.inactiveDay,
                      ]}
                    >
                      {dayInitials[index]}
                    </Text>
                  ))}
                </View>
                <Pressable
                  style={styles.smartWakeUpButton}
                  onPress={() => toggleSmartWakeUp(item.id)}
                >
                  <Text style={styles.smartWakeUpText}>
                    {item.smartWakeUp ? "🔔 Smart Wake" : "⏰ Standard"}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.alarmControls}>
                <Switch
                  trackColor={{ false: "#767577", true: "#4C7DA5" }}
                  thumbColor={item.isActive ? "#FFF" : "#f4f3f4"}
                  onValueChange={() => toggleSwitch(item.id)}
                  value={item.isActive}
                />
                <Pressable
                  onPress={() => handleMenuPress(item)}
                  style={styles.menuButton}
                >
                  <Entypo name="dots-three-vertical" size={20} color="#FFF" />
                </Pressable>
              </View>
            </View>
          )}
        />

        <Pressable
          onPress={() => navigation.navigate("AlarmConfig", { alarm: emptyAlarm })}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>

        <Modal
          visible={isMenuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsMenuVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setIsMenuVisible(false)}
          >
            <View style={styles.contextMenu}>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate("AlarmConfig", {
                    alarm: selectedAlarm || emptyAlarm,
                  });
                  setIsMenuVisible(false);
                }}
              >
                <Text style={styles.menuItemText}>Edit</Text>
              </Pressable>
              <View style={styles.divider} />
              <Pressable
                style={styles.menuItem}
                onPress={() => selectedAlarm && handleDelete(selectedAlarm.id)}
              >
                <Text style={[styles.menuItemText, styles.deleteText]}>
                  Delete
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1B1B",
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    color: "#FFF",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  motivationCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  motivationTitle: {
    color: "#4C7DA5",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  motivationText: {
    color: "#FFF",
    fontSize: 17,
    fontStyle: "italic",
  },
  nextAlarmContainer: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 15,
  },
  nextAlarmText: {
    color: "#FFF",
    fontSize: 16,
  },
  nextAlarmTime: {
    color: "#4C7DA5",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  alarmCard: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    justifyContent: "space-between",
  },
  alarmLeft: {
    flex: 1,
  },
  alarmTime: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  alarmSubject: {
    color: "#AAA",
    fontSize: 16,
    marginVertical: 5,
  },
  daysContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  dayText: {
    width: 20,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
  },
  activeDay: {
    color: "#4C7DA5",
  },
  inactiveDay: {
    color: "#555",
  },
  smartWakeUpButton: {
    marginTop: 8,
  },
  smartWakeUpText: {
    color: "#4C7DA5",
    fontSize: 14,
  },
  alarmControls: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuButton: {
    marginTop: 10,
    padding: 5,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#4C7DA5",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 30,
    lineHeight: 32,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  contextMenu: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    width: 200,
    paddingVertical: 5,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuItemText: {
    color: "#FFF",
    fontSize: 16,
  },
  deleteText: {
    color: "#FF5252",
  },
  divider: {
    height: 1,
    backgroundColor: "#444",
  },
});

export default AlarmScreen;
