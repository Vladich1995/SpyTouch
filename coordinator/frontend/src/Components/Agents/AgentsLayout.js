import React, {useState} from "react";
import {FaArrowsAltH, FaPhone, FaPlus} from "react-icons/fa";
import AgentItem from './AgentItem.js'
import AgentForm from "./AgentForm.js";
import styles from "./AgentsLayout.module.css";
import RequestForm from "./RequestForm.js";

const AgentsLayout = (props) => {
  let count = 0;
  const[currentCity, setCurrentCity] = useState("filterCities");
  const [isAdding, setIsAdding] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const citySelectHandler = (event) => {
    setCurrentCity(event.target.value);
  };

  

  const addAgentHandler = () => {
    setIsAdding(true);
  }

  const requestAgentHandler = () => {
    setIsRequesting(true);
  }

  const cancelAgentRequestHandler = () => {
    setIsRequesting(false);
  }

  if(props.items.length === 0){
    return (
      <div position="absolute">
        <div className={styles.addCard}>
          {(!isAdding && !isRequesting) ?
          <>
            <button type="button" className={`${styles.optionsButton} ${styles.first}`} onClick={addAgentHandler}>Add agent  <FaPlus size="15px" color="green"/></button>
            <button type="button" className={`${styles.optionsButton} ${styles.last}`} onClick={requestAgentHandler} >Request agent <FaArrowsAltH size="15px" color="green" /></button>
          </>
          :
          (isAdding && !isRequesting) ?
          <>
            <AgentForm onCancel={()=> setIsAdding(false)} onSaveAgent={props.onSaveAgent} />
          </>
          :
          (!isAdding && isRequesting) &&
          <>
            <RequestForm onCancel={cancelAgentRequestHandler} user={props.user} />
          </>
          }  
        </div>
        <h1 className={styles.noAgents}>No Agents Registered.</h1>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.selectionDiv}>
        <select name="cities" id="cities" className={styles.selection} onChange={citySelectHandler}>
           <option value="filterCities">Filter by city</option>
           {props.cities.filter((item,
            index) => props.cities.indexOf(item) === index).map(city => <option key = {count++} value={city}>{city}</option>)}
        </select>
      </div>
      {props.items.map(item => (currentCity == item.city || currentCity == "filterCities") && 
        <AgentItem 
          fname={item.fname} 
          lname={item.lname} 
          age={item.age} 
          id={item.tz} 
          city={item.city} 
          address={item.address} 
          mission={item.mission}
          image={item.image}
          funcDelete={props.funcDelete} 
          funcMessage={props.funcMessage} 
          onLocate={props.onLocate}
        />)}
        <div className={styles.addCard}>
          {(!isAdding && !isRequesting) ?
          <>
            <button type="button" className={`${styles.optionsButton} ${styles.first}`} onClick={addAgentHandler}>Add agent  <FaPlus size="15px" color="green"/></button>
            <button type="button" className={`${styles.optionsButton} ${styles.last}`} onClick={requestAgentHandler} >Request agent <FaArrowsAltH size="15px" color="green" /></button>
          </>
          :
          (isAdding && !isRequesting) ?
          <>
            <AgentForm onCancel={()=> setIsAdding(false)} onSaveAgent={props.onSaveAgent} />
          </>
          :
          (!isAdding && isRequesting) &&
          <>
            <RequestForm onCancel={cancelAgentRequestHandler} user={props.user} />
          </>
          }
            
        </div>
    </div>
  );
};

export default AgentsLayout;


