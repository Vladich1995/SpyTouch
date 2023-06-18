import React,{useState, useEffect} from "react";
import io from "socket.io-client";
import Confirm from "../UI/Confirm.js";
import styles from "./AgentItem.module.css";
import { BarLoader } from 'react-spinners';

const AgentItem = (props) => {
  const [isSelected, setIsSelected] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingTime, setIsSettingTime] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(()=>{
    const base64Image = props.image;
    setImage(`data:image/png;base64,${base64Image}`);
    setIsLoading(false);
  }, []);


  const deleteHandler = (event) => {
    props.funcDelete({fname: props.fname, lname: props.lname, id: props.id, city: props.city });
  };

  const messageHandler = (event) => {
    props.funcMessage({fname: props.fname, lname: props.lname, id: props.id });
  }

  const agentSelectHandler = () => {
    setIsSelected(true);
  }

  const locateHandler = async (event) => {
    props.onLocate(props.id, props.fname, props.lname);
    try{
      await fetch(`http://${process.env.BACKEND_URL}:5000/request/location`, {
          method: "POST",
          headers: {
          "Content-Type" : "application/json"
          },
          body: JSON.stringify({
              agentId: props.id
          })
      }).then((response) => {
          return response.json();
      }).then((data) => {
          console.log(data.success);
      });
    } catch (error) {
        alert("Error on location request: ", error);
    }
  }

  const startChatHandler = () => {
    props.funcMessage(props.fname, props.lname, props.id);
  }

  const setTimesHandler = () => {
    setIsSettingTime(true);
  }

  const submitTimesHandler = async (e) => {
    e.preventDefault();
    try{
      await fetch(`http://${process.env.BACKEND_URL}:5000/message/times`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        startTime: startTime,
        endTime: endTime,
        toWhom: props.id
      })
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data.success);
    });

    } catch (err) {
      alert("Error on setting times: ", err);
    }
  }

  const changeStartTimeHandler = (event) => {
    setStartTime(event.target.value);
  }

  const changeEndTimeHandler = (event) => {
    setEndTime(event.target.value);
  }

  const cancelSetHandler = () => {
    setIsSettingTime(false);
  }


  return (
    (isLoading == true) ? <BarLoader color="grey" loading={true} /> :
     <div className={`${styles.agentCard} ${!isSelected ? styles.selected : ''}`} onClick={agentSelectHandler}>
      {!isSelected ?
        <>
          <div className={styles.image}>
            <img src={image} alt="Stored image" className={styles.photo} height="250" width="290" />
          </div>
          <h1 className={styles.title}>{props.fname} {props.lname}</h1>
          <h2 className={styles.agentId}>{props.id}</h2>
        </>
        : 
        <>
          <div className={styles.passport}>
            <img src={image} alt="Stored image" className={styles.photo} height="200" width="290" />
          </div>
          <label className={styles.infoLabel}>{props.fname} {props.lname}</label>
          <label className={`${styles.infoLabel} ${styles.grey}`}>ID: {props.id}</label>
          <label className={`${styles.infoLabel} ${styles.grey}`}>Age: {props.age}</label>
          <label className={`${styles.infoLabel} ${styles.grey}`}>City: {props.city}</label>
          <label className={`${styles.infoLabel} ${styles.grey}`}>Street address: {props.address}</label>
          <label className={`${styles.infoLabel} ${styles.grey}`}>Mission: {props.mission}</label>
          <div className={styles.buttonsContainer}>
            <div className={styles.singleButton}>
              <button type="button" className={styles.optionsButton} onClick={startChatHandler}>Message</button>
            </div>
            <div className={styles.singleButton}>
              <button type="button" className={styles.optionsButton} onClick ={locateHandler}>Locate</button>
            </div>
            <div className={`${styles.singleButton}`}>
              <button type="button" className={`${styles.optionsButton}`} onClick={setTimesHandler}>Set times</button>
            </div>
            <div className={`${styles.singleButton} ${styles.deleteDiv}`}>
              <button type="button" className={`${styles.optionsButton} ${styles.deleteButton}`} onClick={deleteHandler}>Delete</button>
            </div>
          </div>
          {isSettingTime && (
            <form className={styles.timesForm} onSubmit={submitTimesHandler}>
              <div className={styles.inputArea}>
                <input type="text" className={`${styles.timeInput} ${styles.first}`} placeholder="Start" onChange={changeStartTimeHandler}/>
                <input type="text" className={`${styles.timeInput} ${styles.second}`} placeholder="End" onChange={changeEndTimeHandler}/>
              </div>
              <div className={styles.buttonsArea}>
                <button type="submit" className={`${styles.setButtons}`} >Set</button>
                <button type="cancel" className={`${styles.setButtons}`} onClick={cancelSetHandler} >Cancel</button>
              </div>
            </form>
          )}
        </>
      }
    </div>
  );
};

export default AgentItem;
