import React from "react";
import styles from "../../styles/LoadingSection.module.css";

function LoadingSection({ padding }) {
  return (
    <div className={styles.logo} style={{ padding: `${padding} 0` }}>
      <img src="/assets/logos/confluenceTwo.svg" alt="" />
    </div>
  );
}
export default LoadingSection;
