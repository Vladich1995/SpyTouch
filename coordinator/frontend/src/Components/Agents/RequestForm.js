import React, {useState} from 'react';
import styles from './RequestForm.module.css';

const RequestForm = (props) => {
    const [coordinatorBox, setCoordinatorBox] = useState("");
    const [agentIdBox, setAgentIdBox] = useState("");

    const coordinatorChangeHandler = (event) => {
        setCoordinatorBox(event.target.value);
    }

    const agentChangeHandler = (event) => {
        setAgentIdBox(event.target.value);
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        try{
            await fetch("http://localhost:5000/request/agent", {
            method: "POST",
            headers: {
              "Content-Type" : "application/json"
            },
            body: JSON.stringify({
              coordinator: coordinatorBox,
              agent: agentIdBox,
              whoAsk: props.user
            })
          }).then((response) => {
            return response.json();
          }).then((data) => {
            console.log(data);
            setCoordinatorBox("");
            setAgentIdBox("");
          });
          } catch (err){
            console.log(err);
          }
    }

    const cancelRequestHandler = () => {
      props.onCancel();
    }


    return (
        <form onSubmit={submitHandler} className={styles.container}>
          <input type="text" className={styles.input} value={coordinatorBox} onChange={coordinatorChangeHandler} placeholder='Coordinator private number'/>
          <input type="text" className={styles.input} value={agentIdBox} onChange={agentChangeHandler} placeholder='Agent ID'/>
          <button type="submit" className={styles.buttonRequest} >Request</button>
          <button type="button" className={styles.cancel} onClick={cancelRequestHandler} >Cancel</button>  
        </form>
    );
}

export default RequestForm;