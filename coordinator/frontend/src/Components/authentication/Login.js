import React from "react";
import LoginForm from "./LoginForm";
import Logo from "../perms/Logo"
import styles from "./Login.module.css";


const Login = () => {


  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
