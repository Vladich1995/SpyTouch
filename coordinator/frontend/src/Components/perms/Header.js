import React from "react";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <ul>
        <li><div className={styles.image}></div></li>
      </ul>
    </div>
  );
};

export default Header;
