import styles from './Button.module.css';

const Button = ({ disabled, onClick, children }) => (
  <button disabled={disabled} className={styles.button} onClick={onClick}>
    {children}
  </button>
);

export default Button;
