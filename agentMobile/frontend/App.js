import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View} from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import io from "socket.io-client";
import Auth from './components/Auth';
import Chat from './components/Chat';
import Calculator from './components/Calculator';


const Stack = createStackNavigator();

export default function App () {
  const [calc, setCalc] = useState(true);
  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("20:55");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tz, setTz] = useState("");
  const [controlledBy, setControlledBy] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(()=>{
    let currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric"});
    if(currentTime > startTime && currentTime < endTime){
      setCalc(false);
    }

    const newSocket = io.connect("http://192.168.1.20:3007");
    setSocket(newSocket);

    async function prepareRecording() {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    }
  
    prepareRecording();

    async function prepareLocation () {
      try{
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
      }catch (err){}
    }

    prepareLocation();

    const removeToken = async () => {
      try {
        await AsyncStorage.removeItem('jwt_token');
      } catch (e) {
        console.error(e);
      }
    };
    removeToken();

    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt_token');
        return token;
      } catch (e) {
        console.error(e);
      }
    };

    const checkAuthentication = async () => {
      try{
        const token = await getToken();
        if (token) {
          const decodedToken = jwtDecode(token);
          setUsername(decodedToken.username);
          setPassword(decodedToken.password);
          setTz(decodedToken.tz);
          setControlledBy(decodedToken.controlledBy);
          try{
            await fetch("http://192.168.1.20:8000/send/firstmessage", {
                method: "POST",
                headers: {
                "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    id: decodedToken.tz
                })
            }).then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data.success);
            });
        } catch (err) {
            console.log(err);
        }
          setIsSignedIn(true);
        }
      } catch (err) {
        console.log(err);
      }
    };

    checkAuthentication();

  }, []);

  const setTimesHandler = (start, end) => {
    console.log("new times:", start, end)
    setStartTime(start);
    setEndTime(end);
    let currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric"});
    console.log(currentTime)
    if(currentTime > start && currentTime < end){
      setCalc(false);
      console.log("here1")
    }else{
      setCalc(true);
      console.log("here2")
    }
  }

  const setSignedInHandler = () => {
    setIsSignedIn(true);
    console.log("signed")
  }

  const setTzControl = (idNumber, controller) => {
    setTz(idNumber);
    setControlledBy(controller);
  }


  if(calc && isSignedIn){
    return (
      <View style={{ flex: 1 }}>
        <Calculator id={tz} controlledBy={controlledBy} socket={socket} setTimesFunc={setTimesHandler} />
      </View>
    )
  }
  else{
    return (
      <NavigationContainer>
        <Stack.Navigator>
        {(isSignedIn && !calc) ? (
          <>
            <Stack.Screen name="chat" options={{headerShown: false,}} component={Chat} initialParams={{id: tz, socket: socket, setTimesFunc: setTimesHandler, afterAuth: false}} />
          </>
        ) : (
          <>
            <Stack.Screen name="auth" options={{headerShown: false,}} component={Auth} initialParams={{setSignedFunc: setSignedInHandler, setTzControlFunc: setTzControl}} />
            <Stack.Screen name="chat" options={{headerShown: false,}} component={Chat} initialParams={{id: tz, socket: socket, setTimesFunc: setTimesHandler, afterAuth: true}} />
          </>
        )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
