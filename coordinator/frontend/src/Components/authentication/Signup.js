import React from "react";
import SignupForm from "./SignupForm";
import Logo from "../perms/Logo";
import styles from "./Signup.module.css";

const Signup = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <SignupForm />
    </div>
  );
};

export default Signup;
