import savings from "../../img/savings.svg";
import styles from "./home.module.css";

function Company() {
  return (
    <div className={styles.homeContainer}>
      <h1>Sobre nós</h1>
      <p>
        Nosso objetivo é facilitar a criação dos seus projetos, então aqui você
        vai poder criar e organizar todas as informações que você precisa.
      </p>
      <img src={savings} alt="Costs" />
    </div>
  );
}

export default Company;
