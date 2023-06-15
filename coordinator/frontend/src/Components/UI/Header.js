import React,{ useState, useEffect} from "react";
import styles from "./Header.module.css";
import { useLocation } from "react-router-dom";


const Header = (props) => {

  return (
    <div className={styles.header}>
        <div className={styles.image}></div>
        <button type="button" className={styles.logout}>התנתקות</button>
    </div>
  );
};

export default Header;
