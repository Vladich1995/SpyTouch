import React, {useState} from "react";
import styles from "./AgentForm.module.css";
import { useLocation } from "react-router-dom";

const AgentForm = (props) => {
  const [fname, updateFname] = useState("");
  const [lname, updateLname] = useState("");
  const [age, updateAge] = useState("");
  const [id, updateId] = useState("");
  const [city, updateCity] = useState("");
  const [street, updateStreet] = useState("");
  const [mission, updateMission] = useState("");
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");
  const location = useLocation();
  const [image, setImage] = useState(null);

  const fnameChangeHandler= (event) => {
    updateFname(event.target.value);
  };

  const lnameChangeHandler= (event) => {
    updateLname(event.target.value);
  };

  const ageChangeHandler= (event) => {
    updateAge(event.target.value);
  };

  const idChangeHandler= (event) => {
    updateId(event.target.value);
  };

  const cityChangeHandler= (event) => {
    updateCity(event.target.value);
  };

  const streetChangeHandler= (event) => {
    updateStreet(event.target.value);
  };

  const missionChangeHandler= (event) => {
    updateMission(event.target.value);
  };

  const usernameChangeHandler= (event) => {
    updateUsername(event.target.value);
  };
  const passwordChangeHandler= (event) => {
    updatePassword(event.target.value);
  };


  const submitHandler = (event) =>{
    event.preventDefault();
    console.log("in form:" + location.state);
    const agentData ={
      agentFname: fname,
      agentLname: lname,
      agentAge: age,
      agentId: id,
      agentCity: city,
      agentAddress: street,
      agentMission: mission,
      agentUsername: username,
      agentPassword: password,
      agentControlledBy: location.state,
      agentImage: image
    };

    props.onSaveAgent(agentData);
    updateFname("");
    updateLname("");
    updateAge("");
    updateId("");
    updateCity("");
    updateStreet("");
    updateMission("");
    updateUsername("");
    updatePassword("");
    setImage(null);
    props.onCancel();
  };

  const imageUploadHandler = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = reader.result.replace(/^data:image\/(png|jpeg);base64,/, '');
      setImage(base64Image);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  return (
    <form className={styles.container} onSubmit={submitHandler}>
      <input className={styles.input} type="text" value={fname} onChange={fnameChangeHandler} placeholder="First name" required= "true" />
      <input className={styles.input} type="text" value={lname} onChange={lnameChangeHandler} placeholder="Last name" required= "true" />
      <input className={styles.input} type="text" value={age} onChange={ageChangeHandler} placeholder="Age" required= "true" />
      <input className={styles.input} type="text" value={id} onChange={idChangeHandler} placeholder="Agent ID" required= "true" />
      <input className={styles.input} type="text" value={city} onChange={cityChangeHandler} placeholder="City" required= "true" />
      <input className={styles.input} type="text" value={street} onChange={streetChangeHandler} placeholder="Street address" required= "true" />
      <input className={styles.input} type="text" value={mission} onChange={missionChangeHandler} placeholder="Mission" required= "true" />
      <input className={styles.input} type="text" value={username} onChange={usernameChangeHandler} placeholder="Set username" required= "true" />
      <input className={styles.input} type="text" value={password} onChange={passwordChangeHandler} placeholder="Set password" required= "true" />
      <input type="file" className={styles.browse} onChange={imageUploadHandler} />
      <button className={styles.buttonAdd} type="submit">Add</button>
      <button type="button" className={styles.cancel} onClick={props.onCancel}>Cancel</button>
    </form>
  );
};

export default AgentForm;
