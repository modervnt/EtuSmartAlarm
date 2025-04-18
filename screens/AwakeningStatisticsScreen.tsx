import React from "react";
import { View, Text, Button, StyleSheet, BackHandler } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

interface AwakeningStatisticsScreenProps {
    navigation: StackNavigationProp<RootStackParamList, "AwakingStatistics">;
}

const AwakeningStatisticsScreen = () => {
    return(
        <View style={styles.container}>
            <Text style={styles.text}>Page de statistiques de reveil</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#1F1B1B",
    },
    text:{
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFF",
    },
});

export default AwakeningStatisticsScreen;