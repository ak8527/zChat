import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams, Navigate } from 'react-router-dom';

import { postResetPassword } from '../../../store/auth/authMiddleware';
import { resetPasswordSchema } from '../../../utils/validationSchema';
import useForm from '../../../hooks/useForm';
import Button from '../../../components/Button/Button';
import TextField from '../../../components/TextField/TextField';
import ResetPasswordModal from './ResetPasswordModal';
import Loader from '../../../components/Loader/Loader';
import Error from '../Error/Error';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [showModal, setShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const { handleChange, handleSubmit, handleBlur, values, errors } = useForm(
    resetPasswordSchema,
    onResetPassword
  );

  async function onResetPassword() {
    setShowLoader(true);
    try {
      await dispatch(
        postResetPassword({ password: values.newPassword, token: token })
      ).unwrap();
      setShowModal(true);
    } catch (err) {
      console.log('Error:', err);
    } finally {
      setShowLoader(false);
    }
  }

  return (
    <>
      {!token ? (
        <Navigate to={'/login'} />
      ) : (
        <div className={styles.resetPwd}>
          <h1>Create new password</h1>
          <Error />
          <form onSubmit={handleSubmit} className={styles.form}>
            <TextField
              label='New Password'
              name='newPassword'
              type='password'
              values={values.newPassword || ''}
              error={errors ? errors['newPassword'] : null}
              placeholder='********'
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <TextField
              label='Confirm Password'
              name='confirmPassword'
              type='password'
              values={values.confirmPassword || ''}
              error={errors ? errors['confirmPassword'] : null}
              placeholder='********'
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Button>{'Reset Password'}</Button>
          </form>
          <ResetPasswordModal
            isOpen={showModal}
            closeModal={() => {
              setShowModal(false);
            }}
          />
          <Loader
            isOpen={showLoader}
            closeLoader={() => setShowLoader(false)}
          />
        </div>
      )}
    </>
  );
};

export default ResetPassword;
