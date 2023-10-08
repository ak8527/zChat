import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { postLogin } from '../../../store/auth/authMiddleware';
import { loginSchema } from '../../../utils/validationSchema';
import Button from '../../../components/Button/Button';
import Error from '../Error/Error';
import Loader from '../../../components/Loader/Loader';
import TextField from '../../../components/TextField/TextField';
import useForm from '../../../hooks/useForm';
import Checkbox from '../../../components/Checkbox/Checkbox';
import useLocalStorage from '../../../hooks/useLocalStorage';
import BrandLogoSvg from '../../../components/Svg/BrandLogoSvg';
import styles from './Login.module.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);
  const [persistValue, setPersistValue] = useLocalStorage('persist', false);
  const { handleChange, handleSubmit, handleBlur, values, errors } = useForm(
    loginSchema,
    onLogin
  );

  async function onLogin() {
    setShowLoader(true);
    try {
      await dispatch(
        postLogin({
          email: values.email,
          password: values.password,
          remember: persistValue,
        })
      ).unwrap();
      navigate('/home', { replace: true });
    } catch (err) {
      console.log('Error:', err);
    } finally {
      setShowLoader(false);
    }
  }

  return (
    <div className={styles.login}>
      <div className={styles.logo}>
        <BrandLogoSvg />
      </div>
      <div>
        <div className={styles.title}>Welcome back</div>
        <div className={styles.subtitle}>Please enter your details</div>
      </div>
      <Error />
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          label='Email'
          name='email'
          type='email'
          value={values.email || ''}
          error={errors ? errors['email'] : null}
          placeholder='joe1234@domain.com'
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextField
          label='Password'
          name='password'
          type='password'
          value={values.password || ''}
          error={errors ? errors['password'] : null}
          placeholder='*********'
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div>
          <div className={styles.checkbox}>
            <Checkbox
              name='checkbox'
              id='checkbox'
              value={persistValue}
              onChange={(e) => {
                setPersistValue(e.target.checked);
              }}
            />
            <label htmlFor='checkbox'>Remember me</label>
          </div>
          <div className={styles.forgotPassword}>
            <Link to='/forgotPassword'>Forgot Password?</Link>
          </div>
        </div>
        <Button>{'Login'}</Button>
      </form>
      <div className={styles.signup}>
        <Link to='/signup'>
          Don't have account? <span>Signup</span>
        </Link>
      </div>
      <Loader isOpen={showLoader} />
    </div>
  );
};

export default Login;
