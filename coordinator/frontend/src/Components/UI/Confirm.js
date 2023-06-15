import React from "react";
import styles from "./Confirm.module.css";

const Confirm = (props) => {
  const cancelHandler = () => {
    props.cancel();
  };

  const confirmHandler = () => {
    props.confirm();
  };

  return(
    <div className={styles.container}>
      <p className={styles.text}>Are you sure you want to delete {props.agent.fname} {props.agent.lname}, id: {props.agent.id} ? </p>
      <div className={styles.buttons}>
        <button type="button" onClick={confirmHandler}>Confirm</button>
        <button type="button" onClick={cancelHandler}>Cancel</button>
      </div>
    </div>
  );
};

export default Confirm;
