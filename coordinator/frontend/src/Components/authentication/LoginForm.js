import React, {useState} from "react";
import styles from "./LoginForm.module.css";
import {Link, useNavigate} from "react-router-dom";

const LoginForm = () => {
  const [userBox, changeUserBox] = useState("");
  const [privateNumberBox, changePrivateNumberBox] = useState("");
  const [passBox, changePassBox] = useState("");
  const navigate = useNavigate();


  const userChangeHandler = (event) => {
    changeUserBox(event.target.value);
  };

  const privateNumberChangeHandler = (event) => {
    changePrivateNumberBox(event.target.value);
  };

  const passChangeHandler = (event) => {
    changePassBox(event.target.value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    
    try{
      await fetch(`http://${process_env_BACKEND_URL}:5000/getuser/${userBox}/${passBox}/${privateNumberBox}`).then((response) => {
        return response.json();
      }).then((data) => {
        if(data.success == true){
          navigate("/database", {state: data.privateNumber});
        } else {
          alert("Please check the details");
        }
      })
    } catch (err){
      console.log("Something went wrong: ", err);
    };
  };


  return (
    <form className={styles.container} onSubmit={submitHandler} >
      <div id={styles.userDiv}>
        <input className={styles.input} type="text" name="" value={userBox} onChange={userChangeHandler} placeholder="Username"/>
      </div>
      <div id={styles.numberDiv}>
        <input className={styles.input} type="Password" name="" value={privateNumberBox} onChange={privateNumberChangeHandler} placeholder="Identification number"/>
      </div>
      <div id={styles.passDiv}>
        <input className={styles.input} type="Password" name="" value={passBox} onChange={passChangeHandler} placeholder="Password" />
      </div>
      <button type="submit" id={styles.signin} >Sign in</button>
      <Link to="/signup">
        <button type="button" id={styles.create} >Create Account</button>
      </Link>
    </form>
  );
};

export default LoginForm;
