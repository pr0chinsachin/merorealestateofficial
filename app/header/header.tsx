import Navbar from "../navbar/navbar";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.fixedFormContainer}>
      <Navbar />
    </header>
  );
}
