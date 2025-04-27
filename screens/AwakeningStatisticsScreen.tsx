import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Pressable, 
  ScrollView, 
  Dimensions,
  Platform,
  Animated,
  Easing
} from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import DatePicker from "react-native-modern-datepicker";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AwakeningStatisticsScreen = () => {
    // État et refs
    const [selectedDate, setSelectedDate] = useState('2025-04-22');
    const [activeTab, setActiveTab] = useState('daily');
    const [showCalendar, setShowCalendar] = useState(false);
    const [statsData, setStatsData] = useState(generateMockData());
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    // Données simulées
    function generateMockData() {
        return {
            daily: {
                labels: Array.from({length: 7}, (_, i) => `Day ${i+1}`),
                sleepDuration: Array.from({length: 7}, () => Math.floor(Math.random() * 3) + 5),
                qualityScores: Array.from({length: 7}, () => Math.floor(Math.random() * 40) + 60),
                awakeningTimes: Array.from({length: 7}, () => Math.floor(Math.random() * 3) + 5)
            },
            weekly: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                averages: Array.from({length: 4}, () => Math.floor(Math.random() * 20) + 70)
            }
        };
    }

    // Animations
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true
            })
        ]).start();
    }, [activeTab]);

    const handleTabChange = (tab: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setActiveTab(tab);
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setShowCalendar(false);
        // Ici vous pourriez faire un appel API pour les nouvelles données
    };

    // Configuration des graphiques
    const chartConfig = {
        backgroundColor: "#1F1B1B",
        backgroundGradientFrom: "#2A2A2A",
        backgroundGradientTo: "#1E1E1E",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(76, 125, 165, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#4C7DA5"
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Sleep Analytics</Text>
                <TouchableOpacity 
                    onPress={() => setShowCalendar(true)}
                    style={styles.dateSelector}
                >
                    <Text style={styles.dateText}>April 2025</Text>
                    <MaterialIcons name="calendar-today" size={20} color="#4C7DA5" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {['daily', 'weekly', 'monthly'].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tabButton, activeTab === tab && styles.activeTab]}
                        onPress={() => handleTabChange(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Graphiques animés */}
            <Animated.ScrollView
                style={[styles.scrollView, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 'daily' && (
                    <>
                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>Sleep Duration (hours)</Text>
                            <LineChart
                                data={{
                                    labels: statsData.daily.labels,
                                    datasets: [{ data: statsData.daily.sleepDuration }]
                                }}
                                width={SCREEN_WIDTH - 40}
                                height={220}
                                chartConfig={chartConfig}
                                bezier
                                style={styles.chart}
                            />
                        </View>

                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>Sleep Quality Score</Text>
                            <BarChart
                                data={{
                                    labels: statsData.daily.labels,
                                    datasets: [{ data: statsData.daily.qualityScores }]
                                }}
                                width={SCREEN_WIDTH - 40}
                                height={220}
                                chartConfig={chartConfig}
                                style={styles.chart}
                                yAxisSuffix="%"
                                yAxisLabel="" // Ajoutez cette ligne
                                fromZero // Optionnel - force l'axe Y à partir de 0
                            />
                        </View>
                    </>
                )}

                {activeTab === 'weekly' && (
                    <View style={styles.chartContainer}>
                        <Text style={styles.chartTitle}>Weekly Averages</Text>
                        <PieChart
                            data={statsData.weekly.labels.map((label, i) => ({
                                name: label,
                                population: statsData.weekly.averages[i],
                                color: `rgba(76, 125, 165, ${0.2 + (i * 0.2)})`,
                                legendFontColor: "white"
                            }))}
                            width={SCREEN_WIDTH - 40}
                            height={200}
                            chartConfig={chartConfig}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            absolute
                        />
                    </View>
                )}

                {/* Insights section */}
                <View style={styles.insightsContainer}>
                    <Text style={styles.insightsTitle}>Sleep Insights</Text>
                    <View style={styles.insightCard}>
                        <FontAwesome name="moon-o" size={24} color="#4C7DA5" />
                        <View style={styles.insightText}>
                            <Text style={styles.insightMain}>Best night: Day 3 (92%)</Text>
                            <Text style={styles.insightSub}>8h 42m of quality sleep</Text>
                        </View>
                    </View>
                    <View style={styles.insightCard}>
                        <FontAwesome name="bell-o" size={24} color="#4C7DA5" />
                        <View style={styles.insightText}>
                            <Text style={styles.insightMain}>Average wake-up time</Text>
                            <Text style={styles.insightSub}>7:24 AM</Text>
                        </View>
                    </View>
                </View>
            </Animated.ScrollView>

            {/* Calendar Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showCalendar}
                onRequestClose={() => setShowCalendar(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <DatePicker
                            options={{
                                backgroundColor: '#1F1B1B',
                                textHeaderColor: '#4C7DA5',
                                textDefaultColor: '#FFFFFF',
                                selectedTextColor: '#1F1B1B',
                                mainColor: '#4C7DA5',
                                textSecondaryColor: '#D6C7A1',
                            }}
                            current="2025-04-22"
                            selected={selectedDate}
                            mode="calendar"
                            onSelectedChange={handleDateChange}
                        />
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => setShowCalendar(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1F1B1B",
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingHorizontal: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25
    },
    headerText: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold'
    },
    dateSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2A2A',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20
    },
    dateText: {
        color: 'white',
        marginRight: 8,
        fontSize: 16
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        padding: 5
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8
    },
    activeTab: {
        backgroundColor: '#4C7DA5'
    },
    tabText: {
        color: '#999',
        fontWeight: '600'
    },
    activeTabText: {
        color: 'white'
    },
    scrollView: {
        flex: 1
    },
    chartContainer: {
        backgroundColor: '#2A2A2A',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
    },
    chartTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        marginLeft: 5
    },
    chart: {
        borderRadius: 10,
        marginTop: 10
    },
    insightsContainer: {
        marginBottom: 30
    },
    insightsTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15
    },
    insightCard: {
        flexDirection: 'row',
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
        padding: 15,
        marginBottom: 12,
        alignItems: 'center'
    },
    insightText: {
        marginLeft: 15
    },
    insightMain: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 3
    },
    insightSub: {
        color: '#999',
        fontSize: 14
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#1F1B1B',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center'
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#4C7DA5',
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 8
    },
    closeButtonText: {
        color: 'white',
        fontWeight: '600'
    }
});

export default AwakeningStatisticsScreen;