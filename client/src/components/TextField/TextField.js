import { useState } from 'react';

import styles from './TextField.module.css';
import ShowPasswordSvg from '../Svg/ShowPasswordSvg';
import HidePasswordSvg from '../Svg/HidePasswordSvg';

const TextField = ({
  name,
  type,
  value,
  label,
  error,
  onBlur,
  onChange,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`${styles.textField} ${error ? styles.error : ''}`}>
      <label htmlFor={name}>{label}</label>
      <div className={styles.input}>
        <input
          id={name}
          type={showPassword ? 'text' : type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete='off'
        />
        {type === 'password' && (
          <span
            className={styles.passwordSvg}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <ShowPasswordSvg /> : <HidePasswordSvg />}
          </span>
        )}
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default TextField;
