import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Pressable, 
  ScrollView, 
  Dimensions,
  Platform 
} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState, useRef, useEffect } from "react";
import DatePicker from "react-native-modern-datepicker";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ITEM_WIDTH = 60; // Increased width for better touch area
const PADDING = (SCREEN_WIDTH - ITEM_WIDTH) / 2;

const AwakeningStatisticsScreen = () => {
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('2025-04-22');
    const [selectedDay, setSelectedDay] = useState('22');
    const scrollViewRef = useRef<ScrollView>(null);
    
    // Generate days array (1-31)
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

    // Scroll to selected day on initial render
    useEffect(() => {
        scrollToDay(selectedDay);
    }, []);

    const handleDaySelect = (day: string) => {
        setSelectedDay(day);
        scrollToDay(day);
    };
    
    const scrollToDay = (day: string) => {
        const dayIndex = days.indexOf(day);
        if (dayIndex >= 0 && scrollViewRef.current) {
            const offset = dayIndex * ITEM_WIDTH - PADDING;
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({ x: offset, animated: true });
            }, 50); // Small delay to ensure the view is ready
        }
    };
    
    const handleScrollEnd = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const selectedIndex = Math.round((offsetX + PADDING) / ITEM_WIDTH);
        if (selectedIndex >= 0 && selectedIndex < days.length) {
            const newSelectedDay = days[selectedIndex];
            setSelectedDay(newSelectedDay);
        }
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        const day = date.split('-')[2];
        setSelectedDay(day);
        setIsCalendarVisible(false);
        scrollToDay(day);
    };
    
    return (
        <View style={styles.container}>
            {/* Header with date and calendar button */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Statistics</Text>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>apr, {selectedDay}, 2025</Text>
                    <Pressable 
                        onPress={() => setIsCalendarVisible(true)}
                        style={styles.calendarButton}
                    >
                        <MaterialIcons name="calendar-month" size={24} color="white" />
                    </Pressable>
                </View>
            </View>

            {/* Horizontal day picker */}
            <View style={styles.dayPickerContainer}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: PADDING,
                    }}
                    snapToInterval={ITEM_WIDTH}
                    decelerationRate={Platform.OS === 'ios' ? 0.99 : 0.95}
                    onMomentumScrollEnd={handleScrollEnd}
                    snapToAlignment="center"
                >
                    {days.map((day) => (
                        <Pressable
                            key={`day-${day}`}
                            onPress={() => handleDaySelect(day)}
                            style={[
                                styles.dayItem,
                                selectedDay === day && styles.selectedDayItem
                            ]}
                        >
                            <Text style={[
                                styles.dayTextItem,
                                selectedDay === day && styles.selectedDayText
                            ]}>
                                {day}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Statistics content */}
            <View style={styles.statisticsContent}>
                <Text style={styles.statisticsTitle}>Statistics for April {selectedDay}, 2025</Text>
                {/* Add your actual statistics components here */}
                <View style={styles.statisticsBox}>
                    <Text style={styles.statisticsText}>Awakening time: 7:30 AM</Text>
                    <Text style={styles.statisticsText}>Sleep duration: 8h 15m</Text>
                    <Text style={styles.statisticsText}>Quality score: 82/100</Text>
                </View>
            </View>

            {/* Calendar modal */}
            <Modal
                visible={isCalendarVisible}
                transparent={true}
                onRequestClose={() => setIsCalendarVisible(false)}
                animationType="fade"
            >   
                <Pressable
                    style={styles.modalBackground}
                    onPress={() => setIsCalendarVisible(false)}
                >
                    <View style={styles.calendarContainer}>
                        <DatePicker
                            options={{
                                backgroundColor: '#090C08',
                                textHeaderColor: '#2E3F50',
                                textDefaultColor: '#48D1CC',
                                selectedTextColor: '#fff',
                                mainColor: '#4C7DA5',
                                textSecondaryColor: '#D6C7A1',
                                borderColor: 'rgba(122, 146, 165, 0.1)',
                            }}
                            current="2025-04-22"
                            selected={selectedDate}
                            mode="calendar"
                            minuteInterval={30}
                            style={{ borderRadius: 10 }}
                            onSelectedChange={handleDateSelect}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1F1B1B",
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        color: 'white',
        fontSize: 20,
    },
    calendarButton: {
        marginLeft: 15,
    },
    dayPickerContainer: {
        height: 80,
        justifyContent: 'center',
        marginBottom: 20,
    },
    dayItem: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 2,
    },
    selectedDayItem: {
        backgroundColor: '#4C7DA5',
        borderRadius: 30,
    },
    dayTextItem: {
        color: 'white',
        fontSize: 20,
    },
    selectedDayText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22,
    },
    statisticsContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    statisticsTitle: {
        color: 'white',
        fontSize: 18,
        marginBottom: 20,
        fontWeight: '600',
    },
    statisticsBox: {
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        padding: 20,
    },
    statisticsText: {
        color: 'white',
        fontSize: 16,
        marginBottom: 10,
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    calendarContainer: {
        backgroundColor: '#090C08',
        width: '90%',
        borderRadius: 10,
        overflow: 'hidden',
    },
});

export default AwakeningStatisticsScreen;