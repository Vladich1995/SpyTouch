import React, {useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import styles from './AgentManagementPage.module.css';
import Header from "../UI/Header";
import AgentForm from "./AgentForm.js"
import AgentsLayout from "./AgentsLayout";
import Confirm from "../UI/Confirm.js";
import Chat from "../UI/Chat.js";
import EmergencyWindow from "../UI/EmergencyWindow";
import RealLocationWindow from "../UI/RealLocationWindow";
import TransferAgentForm from "./TransferAgentForm";
import io from "socket.io-client";
import LoadingSpinner from "../UI/LoadingSpinner";

const AgentManagementPage = () => {
    const locationSettings = useLocation();
    const [allAgents, updateAllAgents] = useState([]);
    const [allCities, updateAllCities] = useState([]);
    const [flagDelete, setFlagDelete] = useState(false);
    const [flagMessage, setFlagMessage] = useState(false);
    const [agentToDelete, setAgentToDelete] = useState({});
    const [agentToChat, setAgentToChat] = useState({});
    const [flagDownloaded, setFlagDownloaded] = useState(false);
    const [location, setLocation] = useState(locationSettings.state);
    const [count, setCount] = useState(0);
    const [emergency, setEmergency] = useState(false);
    const [emergencyLocation, setEmergencyLocation] = useState(null);
    const [emergencyUri, setEmergencyUri] = useState(null);
    const [emergencyAgent, setEmergencyAgent] = useState(null);
    const [countMessage, setCountMessage] = useState(0);
    const [socket, setSocket] = useState(null);
    const [agentToLocate, setAgentToLocate] = useState(null);
    const [realTimeLocation, setRealTimeLocation] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isTransfering, setIsTransfering] = useState(false);
    const [agentToTransfer, setAgentToTransfer] = useState("");
    const [whoAskTransfer, setWhoAskTransfer] = useState("");
  
  
    useEffect(() => {
        if(socket == null){
            const newSocket = io(`http://${process_env_BACKEND_URL}:3005`);
            console.log("connected to backend");
            setSocket(newSocket);
            return () => {
            newSocket.disconnect();
            };
        }
    }, []);
    
    useEffect(() => {
        if (socket) {
            socket.on('askForAgent', async (message) => {
                setAgentToTransfer(message.agent);
                setWhoAskTransfer(message.whoAsk);
                if(message.whoAsk != location){
                    setIsTransfering(true);
                }
            })
    
            socket.on('ping', (message) => {
            setAgentToChat({id: message.agentId});
            setCountMessage(countMessage + 1);
            setFlagMessage(true);
            });
    
            socket.on('emergencyPing', (message) => {
            setEmergencyLocation(message.location);
            setEmergencyUri(message.uri);
            setEmergencyAgent(message.agentId);
            setEmergency(true);
            });
        }

    }, [socket]);
    
    
  
    useEffect(() => {
      const sendRequest = async () => {
        try{
            if(location != ""){
              const response = await fetch(`http://${process_env_BACKEND_URL}:5000/getagents/${location}`);
              const responseData = await response.json();
              console.log(responseData);
              if(responseData.success == true){
                updateAllAgents(responseData.agents);
                responseData.agents.forEach((agent) => {
                  if(allCities.includes(agent.city) == false){
                    updateAllCities((prevCities) => {
                      return [...prevCities, agent.city];
                    });
                  }
                });
                setFlagDownloaded(true);
              } else {
                alert("Couldn't fetch agents");
              }
            }
          setIsLoading(false);
        } catch (err){
            alert("Error fetching agents list: ", err);
        };
      };
      sendRequest();
    }, [location, count]);
  
  
    const addAgentHandler = async (newAgent) => {
      setFlagDownloaded(false);
      try{
        await fetch(`http://${process_env_BACKEND_URL}:5000/addagent`, {
          method: "POST",
          headers: {
            "Content-Type" : "application/json"
          },
          body: JSON.stringify({
            fname: newAgent.agentFname,
            lname: newAgent.agentLname,
            age: newAgent.agentAge,
            tz: newAgent.agentId,
            city: newAgent.agentCity,
            address: newAgent.agentAddress,
            mission: newAgent.agentMission,
            username: newAgent.agentUsername,
            password: newAgent.agentPassword,
            controlledBy: newAgent.agentControlledBy,
            image: newAgent.agentImage
          })
        }).then((response) => {
          return response.json();
        }).then((data) => {
          updateAllAgents(data.agents);
          data.agents.forEach((agent) => {
            if(allCities.includes(agent.city) == false){
              updateAllCities((prevCities) => {
                return [...prevCities, agent.city];
              });
            }
          });
        });
        setFlagDownloaded(true);
      } catch (err) {
        alert("Error adding an agent: ", err);
      }
    };
  
    const deleteHandler = (props) => {
      setFlagDelete(true);
      setAgentToDelete({fname: props.fname, lname: props.lname, id: props.id, city: props.city});
    };
  
    const cancelDelete = () => {
      setFlagDelete(false);
    };
  
    const  deleteAgent = async () => {
      try{
        await fetch(`http://${process_env_BACKEND_URL}:5000/deleteagent/${agentToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type" : "application/json"
        }
        })
        let index;
        for(let i = 0; i < allAgents.length; i++){
          if(allAgents[i].tz == agentToDelete.id){
            index = i;
           }
         }
        updateAllAgents([...allAgents.slice(0, index), ...allAgents.slice(index + 1)]);
        for(let j = 0; j < allCities.length; j++){
          if(allCities[j] == agentToDelete.city){
            index = j;
          }
        }
        updateAllCities([...allCities.slice(0, index), ...allCities.slice(index + 1)]);
        setFlagDelete(false);
        
      } catch (err){
        alert("Error deleting agent: ", err);
      };
    };
  
    const messageHandler = (fname, lname, id) => {
      setFlagMessage(true);
      setAgentToChat({fname: fname, lname: lname, id: id});
    };
  
    const closeHandler = () => {
      setFlagMessage(false);
    };
  
    const closeEmergencyHandler = () => {
      setEmergency(false);
    }
  
    const realTimeLocationHandler = (id, fname, lname) => {
      setAgentToLocate({fname: fname, lname: lname, id: id});
      setRealTimeLocation(true);
    }
  
    const closeRealLocationHandler = () => {
      setRealTimeLocation(null);
      setAgentToLocate(null);
    }
    const cancelTransferHandler = () => {
      setIsTransfering(false);
      setAgentToTransfer("");
      setWhoAskTransfer("");
    }
  
    return (
        (location != null) &&
        <div className={styles.page}>
            <Header />
            {(flagDownloaded == true) ? <AgentsLayout items={allAgents} funcDelete={deleteHandler} funcMessage={messageHandler} cities={allCities} socket={socket} onSaveAgent={addAgentHandler} onLocate={realTimeLocationHandler} user={location} isLoading={isLoading} /> : <LoadingSpinner />}
            {(flagDelete == true) && <Confirm agent={agentToDelete} cancel={cancelDelete} confirm={deleteAgent} />}
            {(flagMessage == true) && <Chat close={closeHandler} contact={agentToChat} user={location} count={countMessage} socket={socket} />}
            {(emergency == true && emergencyUri && emergencyAgent && emergencyLocation) && <EmergencyWindow location={emergencyLocation} url={emergencyUri} agentId={emergencyAgent} closeWindow={closeEmergencyHandler} />}
            {(realTimeLocation == true) && <RealLocationWindow agentInfo={agentToLocate} closeWindow={closeRealLocationHandler} socket={socket} id={location} />}
            {(isTransfering == true) && <TransferAgentForm agentID={agentToTransfer} whoAsk={whoAskTransfer} allAgents={allAgents} onCancel={cancelTransferHandler} />}
        </div>
    );

}

export default AgentManagementPage;