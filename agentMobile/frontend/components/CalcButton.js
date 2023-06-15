import { Text, View, Pressable, StyleSheet, Dimensions,TextInput } from "react-native";
import { useState, useEffect } from "react";

function CalcButton ({number, calculate}) {
    const width = Dimensions.get("window").width / 4;
    const height = (Dimensions.get("window").height * 7 / 8) / 5;

    function pressHandler () {
        calculate(number.label);
    }
    
    return (
        <Pressable style={[styles.container, {width: width, height: height, backgroundColor: (number.label == '=') ? "orange" : "white"}] } android_ripple={{ color: '#DAA520' }} onPress={pressHandler} >
            <Text style={{color: "black"}}>{number.label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0.3,
    },

});

export default CalcButton;