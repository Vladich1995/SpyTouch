import React, {useState} from "react";
import styles from "./SignupForm.module.css";
import {Link, useNavigate} from "react-router-dom";

const SignupForm = () => {
  const [userBox, changeUserBox] = useState("");
  const [emailBox, changeEmailBox] = useState("");
  const [confEmailBox, changeConfEmailBox] = useState("");
  const [passBox, changePassBox] = useState("");
  const [confPassBox, changeConfPassBox] = useState("");
  const [privateNumberBox, changePrivateNumberBox] = useState("");
  const navigate = useNavigate();

  const changeUserHandler = (event) => {
    changeUserBox(event.target.value);
  };

  const changeEmailHandler = (event) => {
    changeEmailBox(event.target.value);
  };

  const changeConfEmailHandler = (event) => {
    changeConfEmailBox(event.target.value);
  };

  const changePassHandler = (event) => {
    changePassBox(event.target.value);
  };

  const changeConfPassHandler = (event) => {
    changeConfPassBox(event.target.value);
  };

  const changeNumberHandler = (event) => {
    changePrivateNumberBox(event.target.value);
  };


  const submitHandler = async (event) => {
    event.preventDefault();
    try{
      await fetch("http://localhost:5000/adduser", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        username: userBox,
        privateNumber: privateNumberBox,
        email: emailBox,
        password: passBox
      })
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      if(data.success == true){
        navigate("/");
      } else {
        alert("Please verify your details and try again");
      }
      
    });
    } catch (err){
      alert("Something went wrong. Please try again");
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={submitHandler}>
        <div id={styles.userDiv}>
          <input className={styles.input} type="text" name="" value={userBox} placeholder="Username" onChange={changeUserHandler}/>
        </div>
        <div id={styles.numberDiv}>
          <input className={styles.input} type="text" name="" value={privateNumberBox} placeholder="Identification number" onChange={changeNumberHandler}/>
        </div>
        <div id={styles.emailDiv}>
          <input className={styles.input} type="email" name="" value={emailBox} placeholder="Email" onChange={changeEmailHandler}/>
        </div>
        <div id={styles.confEmailDiv}>
          <input className={styles.input} type="email" name="" value={confEmailBox} placeholder="Confirm email" onChange={changeConfEmailHandler}/>
        </div>
        <div id={styles.passDiv}>
          <input className={styles.input} type="Password" name="" value={passBox} placeholder="Password" onChange={changePassHandler}/>
        </div>
        <div id={styles.confPassDiv}>
          <input className={styles.input} type="Password" name="" value={confPassBox} placeholder="Confirm password" onChange={changeConfPassHandler}/>
        </div>
        <Link to="/">
          <button type="button" id={styles.cancel}>Cancel</button>
        </Link>
          <button type="submit" id={styles.signUp}>Sign up</button>
      </form>
    </div>
  );
};

export default SignupForm;
