import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { postSignup } from '../../../store/auth/authMiddleware';
import { signupSchema } from '../../../utils/validationSchema';
import Button from '../../../components/Button/Button';
import Error from '../Error/Error';
import Loader from '../../../components/Loader/Loader';
import TextField from '../../../components/TextField/TextField';
import useForm from '../../../hooks/useForm';
import BrandLogoSvg from '../../../components/Svg/BrandLogoSvg';
import SignupModal from './SignupModal';
import styles from './Signup.module.css';

const Signup = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const { values, errors, handleChange, handleBlur, handleSubmit } = useForm(
    signupSchema,
    onSignup
  );

  async function onSignup() {
    setShowLoader(true);
    try {
      await dispatch(
        postSignup({
          username: values.username,
          email: values.email,
          password: values.password,
        })
      ).unwrap();
    } catch (err) {
      console.log('Error:', err);
    } finally {
      setShowLoader(false);
    }
  }

  return (
    <div>
      <div className={styles.logo}>
        <BrandLogoSvg />
      </div>
      <h1 className={styles.title}>Create an account</h1>
      <Error />
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          label='Username'
          name='username'
          type='text'
          value={values.username || ''}
          placeholder='joe1234'
          error={errors ? errors['username'] : null}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextField
          label='Email'
          name='email'
          type='email'
          value={values.email || ''}
          placeholder='joe1234@domain.com'
          error={errors ? errors['email'] : null}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <TextField
          label='Password'
          name='password'
          type='password'
          value={values.password || ''}
          placeholder='*********'
          error={errors ? errors['password'] : null}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Button>{'Signup'}</Button>
      </form>
      <div className={styles.login}>
        <Link to='/login'>
          Already have an account? <span>Login</span>
        </Link>
      </div>
      <SignupModal isOpen={showModal} closeModal={() => setShowModal(false)} />
      <Loader isOpen={showLoader} closeLoader={() => setShowLoader(false)} />
    </div>
  );
};

export default Signup;
