import React from "react";
import styles from "./Logo.module.css";

const Logo = () => {
    return(
        <div className={styles.container} >
            <div className={styles.image} ></div>
            <label className={styles.label} >SpyTouch</label>
        </div>
    );
}

export default Logo;