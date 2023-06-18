import { FlatList, View, Button, StyleSheet, SafeAreaView,TextInput, Text, Image, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import Message from "./Message";


//HwGv1Z

function Chat ({route}) {
    const socket = route.params.socket;
    const[messageToSend, setMessageToSend] = useState("");
    const[messagesList, updateMessagesList] = useState([]);
    const [user, setUser] = useState(null);
    let count = 1;
    const keyExtractor = (item, index) => item.id;
    useEffect(()=>{
        const getUserParams = async () => {
            try{
                await fetch(`http://192.168.1.20:8000/getuser/${route.params.id}`).then((response) => {
                    return response.json();
                }).then((data) => {
                    setUser(data.user);
                    console.log("user set: ", route.params.id);
                    //sendFirstMessage(data.user.tz);

                })
            } catch (err){
                console.log("errorrr:",err);
            };
        }
        
        getUserParams();
    }, []);

    // const sendFirstMessage = async (tz) => {
    //     try{
    //         await fetch("http://192.168.1.20:8000/send/firstmessage", {
    //             method: "POST",
    //             headers: {
    //             "Content-Type" : "application/json"
    //             },
    //             body: JSON.stringify({
    //                 id: tz
    //             })
    //         }).then((response) => {
    //             return response.json();
    //         }).then((data) => {
    //             console.log(data.success);
    //         });
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }


    
        socket.on("setAgentTimes", (message)=>{
            console.log(message)
            route.params.setTimesFunc(message.startTime, message.endTime);
          });
    
        
 

    useEffect(() => {
        const timer = setTimeout(() => {
            let length = messagesList.length;
            updateMessagesList([...messagesList.slice(1, length)]);
        }, 5000);
        return () => clearTimeout(timer);
    }, [messagesList]);

    useEffect(()=>{
        socket.on('message', (message) => {
            console.log(message);
            let today = new Date().toLocaleDateString();
            const time = new Date();
            let currentTime = time.getHours() + ":" + time.getMinutes();
            const newMessage = {
            text: message,
            date: today,
            time: currentTime,
            isent: false
            };
            updateMessagesList((prevMessages) => {
                return [...prevMessages, newMessage];
            });
        });
    }, [])

    

    const submitHandler = async () => {
        let today = new Date().toLocaleDateString();
        const time = new Date();
        let currentTime = time.getHours() + ":" + time.getMinutes();
        let tempMessage;
        try{
            const newMessage = ({
                text: messageToSend,
                date: today,
                time: currentTime,
                isent: true
            });
            updateMessagesList((prevMessages) => {
                return [...prevMessages, newMessage];
            });
            tempMessage = messageToSend;
            setMessageToSend("");
            await fetch("http://192.168.1.20:8000/send", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                message: tempMessage,
                id: route.params.id,
                toWhom: user.controlledBy
                })
            }).then((response) => {
                return response.json();
            }).then((data) => {
                
            });
        } catch (err) {
            console.log(err);
        };
        setMessageToSend("");
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.logo}>
                <Image
                    source={require('../images/phone.png')} // Set the path to your image file
                    style={{ width: 30, height: 55, }} // Set the desired width and height for the image
                />
                <Text style={{color:"rgb(69, 168, 168)", fontSize: 20,}}>SpyTouch</Text>
            </View>
            <View style={styles.chatArea} >
                <FlatList
                    data={messagesList}
                    renderItem={({item}) => <Message message={item} />}
                    keyExtractor={(item, index) => index.toString()}   
                />
            </View>
            <View style={styles.typingArea} >
                <TextInput 
                    style={styles.input} 
                    enterKeyHint="send" 
                    value={messageToSend} 
                    onChangeText={setMessageToSend} 
                    onSubmitEditing={submitHandler} 
                    placeholder="Message to send.."
                />
            </View>
        </SafeAreaView>
    );
};

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#828282",
        borderColor: "white",
        borderWidth: 1
    },
    logo: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row-reverse",
    },
    chatArea: {
        flex: 6,
    },
    typingArea: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    input: {
        height: 40,
        borderColor: "white",
        width: "70%",
        borderWidth: 0.5,
        backgroundColor: "white",
        borderRadius: 20,
        textAlign: "center"
    },
    hidden: {
        position: 'absolute',
        left: -1000,
        top: -1000,
        width: 0,
        height: 0,
    },
});

export default Chat;