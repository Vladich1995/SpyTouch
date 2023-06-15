import {View, StyleSheet, Text} from "react-native";


function Message ({message}) {
    return (
        <View style={styles.container} >
            <View style={styles.title}>
                <Text style={{color: message.isent ? "green" : "red", alignSelf: message.isent ? "flex-start" : "flex-end"}}>{message.date}, {message.time}</Text>
            </View>
            <View style={[styles.message, {alignSelf: message.isent ? "flex-start" : "flex-end"}]}>
                <Text style={{color: message.isent ? "green" : "red", fontSize: 15, alignSelf: "center" }} >{message.text}</Text>
            </View>
        </View>
        
    );
    
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        width: "100%",
    },
    title: {
        height: 30,
        width: "100%",
    },
    message:{
        height: 50,
        width: "60%",
        backgroundColor: "white",
        borderRadius: 20, 
        justifyContent: "center"
    }
});

export default Message;

