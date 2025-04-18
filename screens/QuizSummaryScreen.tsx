import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";


const QuizSummaryScreen = () => {
    return(
        <View style={styles.container}>
            <Text style={styles.text}>Quiz Summary page</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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

export default QuizSummaryScreen;