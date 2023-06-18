const aes = require('./Utility/crypto');
const crypto = require("crypto");
const jwt = require('jsonwebtoken')
const express=require('express');
const socketIO=require('socket.io');
const http=require('http')
const port=3001;
var app=express();
let server = http.createServer(app);
var io=socketIO(server); 
const mongoose = require("mongoose");
const Contact = require('./models/contact');
const Qmessage = require('./models/qmessage');
const { send } = require('process');
const { SocketAddress } = require('net');


let contacts;
let bob = crypto.getDiffieHellman("modp15");
bob.generateKeys('base64');



const fetchContactsFromDatabase = async (eSC) => {
  //Maybe add await
  await Contact.find({})
  .then((list) => {
    eSC(list);
  })
  .catch((err) => {
    console.log(err);
  });
}

const establishSocketConnection = (list) => {
  // make connection with user from server side
  contacts = list.map(contact => contact.toObject({ getters: true }));
  io.on('connection', (socket)=>{
    //Establishing connection with every user:
    //Every time the server resets and detects a connection, it checks who is the connected user by sending a ping to it's socket.id
    //and receiving the users id to match it to the existed one.
    console.log('New user connected: ' ,socket.id);
    socket.emit('startEstablishConnection', {
      publicKey: bob.getPublicKey(),
    });


    socket.on('endEstablishConnection', (message)=>{
      if(message.id){
        bobSecret = bob.computeSecret(message.publicKey, null, "hex");
        let index = null;
        for(let i = 0; i < contacts.length; i++){
          if(contacts[i].id == undefined && contacts[i].socketID == socket.id){
            contacts[i].id = message.id;
          } else {
            if(contacts[i].id == message.id){
              index = i;
              break;
            }
          }
        }
        if(index != null){
          contacts[index].socketID = socket.id;
          contacts[index].socketIP = socket.request.connection.remoteAddress;
          contacts[index].online = true;
          contacts[index].secretKey = bobSecret;
          updateSocketSettings(message.id, socket.id, socket.request.connection.remoteAddress, bobSecret);
          console.log("CONTACTS AFTER SERVER RESET:", contacts)
          fetchQueueMessages(message.id, socket.id);
        } else {
          contacts.push({id: message.id, socketID: socket.id, socketIP: socket.request.connection.remoteAddress, online: true, secretKey: bobSecret});
          addSocketSettings(message.id, socket.id, socket.request.connection.remoteAddress, true, bobSecret);
          console.log("CONTACTS AFTER FIRST MESSAGE:", contacts)
          fetchQueueMessages(message.id, socket.id);
        }
      }
    })
    //////////////////////////////////////////


    socket.on('firstMessage', (newMessage)=>{
      //Every user sends a message every time he logs in his account. The message includes his id to match and store it
      //with its corresponding socket.id
      socket.emit('startEstablishConnection', {
        publicKey: bob.getPublicKey(),
      });
  })
  ////////////////////////////////////////////


    socket.on('createMessage', (newMessage)=>{
          let sendTo = newMessage.toWhom;
          console.log(sendTo);
          let index;
          let secretKey;
          let token;
          let addressSecretKey;
          let senderID = newMessage.id;
          for(let i = 0; i < contacts.length; i++){
            try{
              if(contacts[i].id == sendTo){
                index = i;
                addressSecretKey = contacts[i].secretKey;
              }
              if(contacts[i].id == senderID){
                contacts[i].socketID = socket.id;
                contacts[i].socketIP = socket.request.connection.remoteAddress;
                contacts[i].online = true;
                updateSocketSettings(newMessage.id, socket.id, socket.request.connection.remoteAddress)
                secretKey = contacts[i].secretKey;
              }
            } catch (err) {
              console.log("error: ", err);
            }
          }
          try{
            if(contacts[index].online == true){
              const decodedMessage = jwt.verify(newMessage.token, secretKey);
              if (decodedMessage === newMessage.text) {
                console.log('Message received:', newMessage.text);
                token = jwt.sign(decodedMessage, addressSecretKey);
              } else {
                console.log('Message has been tampered with!');
              }
              console.log(senderID);
              io.to(contacts[index].socketID).emit('message', {text: decodedMessage, token, from: senderID, to: newMessage.toWhom});
              console.log("message: ", newMessage.text, "is sent to: ", contacts[index].socketID);
            }
            else{
              //if not online, store messages in queue
              storeMessageInQueue(newMessage.text, senderID, sendTo);
            }
          } catch (err) {
            console.log("error: ", err);
          }
    });


    socket.on('emergencyMessage', (message)=>{
      console.log("got emergency")
      let sendTo = message.toWhom;
      let index;
      let senderID;
      for(let i = 0; i < contacts.length; i++){
        try{
          if(contacts[i].id == sendTo){
            index = i;
          }
          if(contacts[i].socketID == socket.id){
            senderID = contacts[i].id;
          }
        } catch (err){
          console.log("error:", err);
        }
      }
      try{
        if(contacts[index].online == true){
          console.log("audio link:", message.uri)
          console.log("Socket: ",contacts[index].socketID);
          io.to(contacts[index].socketID).emit('emergency', {uri: message.uri, location: message.location, agentId: message.id});
        }
        else{
              //if not online, store messages in queue
        }
      } catch (err){
        console.log("error:", err);
      }
    });

    socket.on('requestLocation', (message) => {
      console.log(message.agentId);
      let sendTo = message.agentId;
      let index;
      let senderID = message.id;
      for(let i = 0; i < contacts.length; i++){
        if(contacts[i].id == sendTo){
          index = i;
        }
      }
      if(contacts[index].online == true){
        console.log("hereeee")
        io.to(contacts[index].socketID).emit('location', {whoAsk: senderID, sendTo: sendTo});
      }
      else{
            //if not online, store messages in queue
      }
    });

    socket.on('myLocation', (message)=>{
      console.log("got it")
      console.log(message.toWhom)
      let sendTo = message.toWhom;
      let index;
      let senderID = message.id;
      for(let i = 0; i < contacts.length; i++){
        if(contacts[i].id == sendTo){
          index = i;
        }
      }
      try{
        if(contacts[index].online == true){
          io.to(contacts[index].socketID).emit('agentLocation', {location: message.currentLocation, toWhom: message.toWhom, agentID: message.id});
        }
        else{
              //if not online, store messages in queue
        }
      } catch (err) {
        console.log("error: ", err);
      }
    });

    socket.on("times", (message)=> {
      let sendTo = message.toWhom;
      let index;
      let senderID;
      for(let i = 0; i < contacts.length; i++){
        if(contacts[i].id == sendTo){
          index = i;
        }
        if(contacts[i].socketID == socket.id){
          senderID = contacts[i].id;
        }
      }
      try{
        if(contacts[index].online == true){
          io.to(contacts[index].socketID).emit('setTimes', {startTime: message.startTime, endTime: message.endTime, sendTo: sendTo});
        }
        else{
              //if not online, store messages in queue
        }
      } catch (err){

      }
    })

    const storeMessageInQueue = async (text, senderID, receiverID) => {
      let time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric"});
      const currentDate = new Date();

      // Get the individual components of the current date
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');

      // Create a string representation of the current date
      const date = `${day}-${month}-${year}`;

      const newQmessage = new Qmessage({
        text,
        senderID,
        receiverID,
        date,
        time
      });
      try{
          await newQmessage.save();
      } catch (err) {
          console.log("error:", err);
      }
    }
    const fetchQueueMessages = (id, socketID) => {
      Qmessage.find({receiverID: id})
      .then((list) => {
        sendQueueMessage(list, socketID)
      })
      .catch((err) => {
        console.log(err);
      });
    }

    const sendQueueMessage = (list, socketID) => {
      for(let i = 0; i < list.length; i++){
        io.to(socketID).emit('message', {text: list[i].text, from: list[i].senderID, to: list[i].receiverID});
        const messageID = list[i]._id;
        cleanMessagesQueue(messageID);
      }
    }

    const cleanMessagesQueue = async (messageID) => {
      let message;
      try{
          //message = await Qmessage.findOne({_id: messageID});
          await Qmessage.deleteOne({ _id: messageID });
          console.log("message removed from queue");
      }catch (err) {
          console.log("error:", err);
      };
    }

    socket.on('onDC', async (message) => {
      console.log('disconnected from user');
      let index;
      for(let i = 0; i < contacts.length; i++){
        if(contacts[i].id == message.userID){
          index = i;
          break;
        }
      }
      if(contacts[index] != null){
        let updated = await Contact.updateOne({id: contacts[index].id},{ $set: { online: false } });
        contacts[index].online = false;
      }
      console.log(contacts);
    });
    

    // when server disconnects from user
    socket.on('disconnect', async ()=>{
      console.log('disconnected from user');
      let index;
      for(let i = 0; i < contacts.length; i++){
        if(contacts[i].socketID == socket.id){
          index = i;
          if(contacts[index] != null){
            let updated = await Contact.updateOne({id: contacts[index].id},{ $set: { online: false } });
            contacts[index].online = false;
          }
        }
      }
      console.log(contacts);
    });
  });
}




const updateSocketSettings = async (contactID, socketID, socketIP, secretKey) => {
  try{
    let updated;
    if(secretKey != null){
      updated = await Contact.updateOne({id: contactID},{ $set: { socketID: socketID, socketIP: socketIP, online: true, secretKey: secretKey} });
    }
    else{
      updated = await Contact.updateOne({id: contactID},{ $set: { socketID: socketID, socketIP: socketIP, online: true} });
    }
  } catch (err) {
    console.log(err);
  }
}

const addSocketSettings = async (id, socketID, socketIP, online, secretKey) => {
  const newContact = new Contact({
    id,
    socketID,
    socketIP,
    online,
    secretKey: secretKey
  });
  try{
      await newContact.save();
  } catch (err) {
      console.log("error:", err);
  }
}
 

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cq41rgq.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
      server.listen(port);
      console.log("Database is up and ready and server is running on port: ", port);
      fetchContactsFromDatabase(establishSocketConnection);
    })
    .catch(err => {
        console.log("there was error");
    });