import React from "react";
import styles from "./SingleMessage.module.css";

const SingleMessage = (props) => {

    return (
        <div className={styles.container}>
            <label className={`${styles.label} ${ (props.message.agentId == props.message.sender ) ? styles.labelReceived : styles.labelSent}`}>{props.message.date}, {props.message.time}, {props.message.sender}</label>
            <div className={`${styles.message} ${ (props.message.agentId == props.message.sender ) ? styles.messageReceived : styles.messageSent}`}>
                <p className={`${ (props.message.agentId == props.message.sender ) ? styles.textReceived : styles.textSent}`}>{props.message.message}</p>
            </div>
        </div>
    );
};

export default SingleMessage;