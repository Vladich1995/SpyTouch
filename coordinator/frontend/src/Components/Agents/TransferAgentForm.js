import styles from './TransferAgentForm.module.css';

const TransferAgentForm = (props) => {
    
    const transferAgentHandler = async () => {
      try{
        await fetch(`http://${process.env.BACKEND_URL}:5000/agent/transfer`, {
            method: "POST",
            headers: {
              "Content-Type" : "application/json"
            },
            body: JSON.stringify({
              agent: props.agentID,
              user: props.whoAsk
            })
          }).then((response) => {
            return response.json();
          }).then((data) => {
            for(let i = 0; i < props.allAgents.length; i++){
              if(props.allAgents[i].tz == props.agentID){
                props.allAgents[i].controlledBy = props.whoAsk;
                break;
              }
            }
            props.onCancel();
          });
      } catch (err) {
        alert("Error transfering agent: ", err);
      }
    }

    const refuseTransferHandler = () => {
        props.onCancel();
    }

    return (
        <div className={styles.container}>
            <label>Coordinator {props.whoAsk} asks to transfer responsibility for agent {props.agentID}</label>
            <div className={styles.buttonsContainer}>
                <button type="button" onClick={transferAgentHandler} >Accept</button>
                <button type="button" onClick={refuseTransferHandler} >Refuse</button>
            </div>
        </div>
    );
}

export default TransferAgentForm;