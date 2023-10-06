import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be 6 char long')
    .required('Password is required'),
  remember: yup.boolean().oneOf([true, false]),
});

export const signupSchema = loginSchema.shape({
  username: yup
    .string()
    .min(4, 'Username must be more than 4 char.')
    .max(20, 'Username must not be more than 4 char')
    .required('Username can not be empty'),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
});

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(6, 'Password must be 6 char long')
    .required('New Password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('newPassword')], 'Confirm password does not match'),
});
