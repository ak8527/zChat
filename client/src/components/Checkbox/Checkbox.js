import styles from './Checkbox.module.css';

const Checkbox = ({ id, value, name, onChange }) => (
  <input
    className={styles.checkbox}
    checked={value}
    onChange={onChange}
    type='checkbox'
    id={id}
    name={name}
  />
);

export default Checkbox;
