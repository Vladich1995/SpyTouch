import { FlatList, View, Button, StyleSheet, SafeAreaView, Text, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import {encode} from 'base-64';
import * as FileSystem from 'expo-file-system';
import CalcButton from "./CalcButton";




function Calculator ({id, controlledBy, socket, setTimesFunc}) {
    const [resultString, setResultString] = useState("");
    const [resultValue, setResultValue] = useState(0);
    const [pressedEqual, setPressedEqual] = useState(false);
    const [emergency, setEmergency] = useState(false);
    const [uri, setUri] = useState(null);
  
    const [location, setLocation] = useState(null);

    // useEffect(()=>{
    //     const sendFirstMessage = async () => {
    //         try{
    //             await fetch("http://192.168.1.20:8000/send/firstmessage", {
    //                 method: "POST",
    //                 headers: {
    //                 "Content-Type" : "application/json"
    //                 },
    //                 body: JSON.stringify({
    //                     id: id
    //                 })
    //             }).then((response) => {
    //                 return response.json();
    //             }).then((data) => {
    //                 console.log(data.success);
    //             });
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     }
    //     sendFirstMessage();
    // }, [])


    const keys = [
        { key: 'C', label: 'C' },
        { key: '+/-', label: '+/-' },
        { key: '%', label: '%' },
        { key: '/', label: '/' },
        { key: '7', label: '7' },
        { key: '8', label: '8' },
        { key: '9', label: '9' },
        { key: 'X', label: 'X' },
        { key: '4', label: '4' },
        { key: '5', label: '5' },
        { key: '6', label: '6' },
        { key: '-', label: '-' },
        { key: '1', label: '1' },
        { key: '2', label: '2' },
        { key: '3', label: '3' },
        { key: '+', label: '+' },
        { key: '.', label: '.' },
        { key: '0', label: '0' },
        { key: 'DEL', label: 'DEL' },
        { key: '=', label: '=' },
      ];
    const numbers = ["0","1","2","3","4","5","6","7","8","9"];

    socket.on("setAgentTimes", (message)=>{
        console.log(message)
        setTimesFunc(message.startTime, message.endTime);
      });

    socket.on('realLocation',async  (message)=>{
        try{
            let loc = await Location.getCurrentPositionAsync({});
            try{
                await fetch("http://192.168.1.20:8000/send/location", {
                    method: "POST",
                    headers: {
                    "Content-Type" : "application/json"
                    },
                    body: JSON.stringify({
                        currentLocation: loc,
                        toWhom: message.whoAsk,
                        id: id
                    })
                }).then((response) => {
                    return response.json();
                }).then((data) => {
                    console.log("success:",data.success);
                });
            } catch (error) {
                console.log(error);
            }
        } catch (err) {
            console.log(err);
        }
    });

    const encodeAudioFile = async (uri) => {
        try {
          const fileData = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
      
          return fileData;
        } catch (error) {
          console.log('Error encoding audio file:', error);
          return null;
        }
      };



    async function startRecording () {
        try {
          const recording = new Audio.Recording();
          await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
          await recording.startAsync();
          setTimeout(async () => {
            await recording.stopAndUnloadAsync();
            const audioData = await FileSystem.readAsStringAsync(recording.getURI(), {
                encoding: FileSystem.EncodingType.Base64,
            });
            setUri(audioData);
           
          }, 5000);
        } catch (error) {
          console.log(error);
        }
    }

    useEffect(()=>{
        getLocation();
        setEmergency(false);
    }, [uri])

   


    async function getLocation () {
        try{
            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(()=>{
        if(emergency == true){
            startRecording();
        }
    }, [emergency]);

    useEffect(()=>{
        async function sendData () {
            if(uri != null && location != null){
                console.log("Sending emergency");
                try{
                    await fetch("http://192.168.1.20:8000/send/emergency", {
                        method: "POST",
                        headers: {
                        "Content-Type" : "application/json"
                        },
                        body: JSON.stringify({
                            uri: uri,
                            location: location,
                            id: id,
                            controlledBy: controlledBy
                        })
                    }).then((response) => {
                        return response.json();
                    }).then((data) => {
                        console.log("emergency sent");
                    });
                } catch (err) {
                    console.log("error:",err);
                }
            }
        }
        sendData();
    }, [location]);

    function calculateHandler (value) {
        setPressedEqual(false);
        switch(value) {
            case '=':
                if(resultString.includes("303")){
                    setEmergency(true);
                }
              setPressedEqual(true);
                setResultString("");
                break;
            case '+':
              setResultString(resultString + value);
                break;
            case '-':
                setResultString(resultString + value);
                break;
            case '*':
                setResultString(resultString + value);
                break;
            case '/':
                setResultString(resultString + value);
                break;
            case 'C':
                setResultValue(0);
                setResultString("0");
                break;
            case 'DEL':
                setResultString(resultString.slice(0, -1));
                break;
            case '%':
                setResultValue(resultValue * value);
                break;
            case '+/-':
                setResultValue(resultValue / value);
                break;
            case '.':
                setResultString(resultString + value);
                break;
            default:
                setResultString(resultString + value);
          } 
          if(numbers.includes(value)){
            if(resultString.slice(-1) == "+"){
                console.log(resultValue + parseInt(value));
                setResultValue(resultValue + parseInt(value));
            }
            if(resultString.slice(-1) == "-"){
                setResultValue(resultValue - parseInt(value));
            }
            if(resultString.slice(-1) == "*"){
                setResultValue(resultValue * parseInt(value));
            }
            if(resultString.slice(-1) == "/"){
                setResultValue(resultValue / parseInt(value));
            }
          }
    }

    return (
        <SafeAreaView style={styles.container} >
            <StatusBar />
            <View style={styles.result} >
                <Text style={{fontSize: 70}}>{(!pressedEqual) ? resultString : resultValue}</Text>
            </View>
            <View style={styles.buttons} >
            <FlatList
                data={keys}
                numColumns={4}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => <CalcButton number={item} calculate={calculateHandler}  />}
                columnWrapperStyle={styles.row}
            />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    result: {
        flex: 1,
        backgroundColor: "orange"
    },
    buttons: {
        flex: 7,
    },

});

export default Calculator;