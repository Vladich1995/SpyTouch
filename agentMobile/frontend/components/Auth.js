import {View, TextInput, Image, StyleSheet, Button, KeyboardAvoidingView, Platform, Text, StatusBar, LogBox} from "react-native";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

function Auth ({navigation, route}) {
    LogBox.ignoreLogs([ 'Non-serializable values were found in the navigation state', ]);
    const [userBox, changeUserBox] = useState("");
    const [idNumberBox, changeIdNumberBox] = useState("");
    const [passBox, changePassBox] = useState("");
 

    const submitHandler = async () => {
        try{
            await fetch(`http://192.168.1.20:8000/auth/${userBox}/${passBox}/${idNumberBox}`).then((response) => {
                return response.json();
            }).then((data) => {
                if(data.exists == true){
                    storeToken(data.token);
                    const decodedToken = jwtDecode(data.token);
                    route.params.setTzControlFunc(idNumberBox, decodedToken.controlledBy);
                    route.params.setSignedFunc();
                    navigation.navigate("chat", {id: idNumberBox});
                }
            })
        } catch (err){
            console.log(err);
        };
    };

    const storeToken = async (token) => {
        try {
          await AsyncStorage.setItem('jwt_token', token);
        } catch (e) {
          console.error(e);
        }
        console.log(route.params.firstSent)
        if(route.params.firstSent == false){
            try{
                await fetch("http://192.168.1.20:8000/send/firstmessage", {
                    method: "POST",
                    headers: {
                    "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        id: idNumberBox
                    })
                }).then((response) => {
                    return response.json();
                }).then((data) => {
                    console.log(data.success);
                    socket.emit('storeID', {
                        id:decodedToken.tz
                    });
                });
            } catch (err) {
                console.log(err);
            }
        }
    };


   return(
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
        <StatusBar style="auto" />
        <View style={styles.logo}>
            <Image
                source={require('../images/phone.png')} // Set the path to your image file
                style={{ width: 30, height: 55, marginTop: "20%" }} // Set the desired width and height for the image
            />
            <Text style={{color:"rgb(84, 191, 191)", fontSize: 20, marginTop: "20%"}}>SpyTouch</Text>
        </View>
        <View style={styles.inputContainer}>
            <TextInput style={styles.input} secureTextEntry={true} placeholder="Username" placeholderTextColor="grey" onChangeText={changeUserBox} value={userBox} />
            <TextInput style={styles.input} secureTextEntry={true} placeholder="Password" placeholderTextColor="grey" onChangeText={changePassBox} value={passBox} />
            <TextInput style={styles.input} secureTextEntry={true} placeholder="ID" placeholderTextColor="grey" onChangeText={changeIdNumberBox} value={idNumberBox} />
        </View>
        <View style={styles.buttonContainer}>
            <Button title="Login" style={styles.button} color="black" onPress={submitHandler} />
        </View>
    </KeyboardAvoidingView>
   ); 
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#393939"
    },
    logo: {
        flex: 0.7,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row-reverse",
    },
    inputContainer: {
        width: "80%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        textAlign: "center",
        marginTop: 20,
        backgroundColor: "black",
        color: "white",
    },
    buttonContainer: {
        flex: 1,
        width: "80%",
    },
    button: {
        width: "80%",
    }
});

export default Auth;