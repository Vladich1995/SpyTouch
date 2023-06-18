import React,{useState, useEffect} from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import SingleMessage from "./SingleMessage";
import styles from "./Chat.module.css";
import io from "socket.io-client";


const Chat = (props) => {
  const[messageToSend, setMessageToSend] = useState("");
  const[messagesList, updateMessagesList] = useState([]);
  const [countMessage, setCountMessage] = useState(props.count);
  let count = 1;
  const socket = props.socket;

  useEffect(() => {
    if (socket) {
      socket.on('ping', async (message) => {
        console.log("came to chat")
        try{
          console.log(props.contact.id);
          const response = await fetch(`http://${process.env.BACKEND_URL}:5000/getmessages/${message.agentId}`);
          const responseData = await response.json();
          updateMessagesList(responseData.messages);
        } catch (err) {
          alert("Error fetching messages: ", err);
        };
      });
    }
  }, [socket]);
  

  useEffect(() => {
    const loadMessages = async () => {
      try{
        const response = await fetch(`http://${process.env.BACKEND_URL}:5000/getmessages/${props.contact.id}`);
        const responseData = await response.json();
        updateMessagesList(responseData.messages);
      } catch (err) {
        alert("Error loading messages: ", err);
      };
    };
    loadMessages();
  },[props.contact.id]);





  const submitHandler = async (event) => {
    event.preventDefault();
    let today = new Date().toLocaleDateString();
    const time = new Date();
    let currentTime = time.getHours() + ":" + time.getMinutes();
    try{
      await fetch(`http://${process.env.BACKEND_URL}:5000/storemessage`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        message: messageToSend,
        agentId: props.contact.id,
        date: today,
        time: currentTime,
        sender: props.user,
        receiver: props.contact.id
      })
    }).then((response) => {
      return response.json();
    }).then((data) => {
      updateMessagesList(data.messages);
    });
    } catch (err) {
      alert("Error sending message: ", err);
    };
    setMessageToSend("");
  };

  const closeWindow = () => {
    props.close();
  };


  return(
    <div className={styles.container}>
      <button className={styles.close} onClick={closeWindow}>X</button>
      <div className={styles.contactInfo}><h3>Chatting with {props.contact.fname} {props.contact.lname} ({props.contact.id})</h3></div>
      <ScrollToBottom className={styles.messages}>
        {messagesList.map((single) => <SingleMessage message={single} key={count++}/>)}
      </ScrollToBottom>
      <div className={styles.compose}>
        <form onSubmit={submitHandler}>
          <input type="text" value={messageToSend} onChange={(e) => setMessageToSend(e.target.value)} className={styles.text} />
          <button type='submit' className={styles.submit}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
