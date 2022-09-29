import loading from "../../img/loading.svg";

import styles from "./loading.module.css";

function Loading() {
  return (
    <div className={styles.loader_container}>
      <img className={styles.loader} src={loading} alt="loading" />
    </div>
  );
}

export default Loading;
