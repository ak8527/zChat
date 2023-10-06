import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { postForgotPassword } from '../../../store/auth/authMiddleware';
import { forgotPasswordSchema } from '../../../utils/validationSchema';
import Button from '../../../components/Button/Button';
import TextField from '../../../components/TextField/TextField';
import ForgotPasswordModal from './ForgotPasswordModal';
import useForm from '../../../hooks/useForm';
import Loader from '../../../components/Loader/Loader';
import Error from '../Error/Error';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const { handleChange, handleSubmit, handleBlur, values, errors } = useForm(
    forgotPasswordSchema,
    onForgotPassword
  );

  async function onForgotPassword() {
    setShowLoader(true);
    try {
      await dispatch(postForgotPassword({ email: values.email })).unwrap();
      setShowModal(true);
    } catch (err) {
      console.log('Error:', err);
    } finally {
      setShowLoader(false);
    }
  }

  return (
    <div className={styles.forgotPwd}>
      <h1>
        <div>Forgot</div>
        <div>Password?</div>
      </h1>
      <Error />
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          label='Enter email address associated with your account'
          name='email'
          type='email'
          value={values.email || ''}
          error={errors ? errors['email'] : null}
          placeholder='name@domain.com'
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Button>{'Send Instructions'}</Button>
      </form>
      <div className={styles.signup}>
        <Link to='/signup'>
          Don't have account? <span>Signup</span>
        </Link>
      </div>
      <ForgotPasswordModal
        isOpen={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
      />
      <Loader isOpen={showLoader} closeLoader={() => setShowLoader(false)} />
    </div>
  );
};

export default ForgotPassword;
