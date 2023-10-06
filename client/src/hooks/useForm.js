import { useEffect, useState } from 'react';

const useForm = (validateSchema, callback) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setErrors({});
    validateSchema
      .validate(values, { abortEarly: false })
      .then(() => {
        setIsSubmitting(true);
      })
      .catch((err) => {
        err.inner.forEach((error) => {
          if (touched[error.path] || isSubmitting)
            setErrors((prev) => ({ ...prev, [error.path]: error.message }));
        });
      });
  }, [validateSchema, values, touched, isSubmitting]);

  // Form submit handler
  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    setIsSubmitting(true);
    if (Object.keys(errors).length === 0 && isSubmitting) callback();
  };

  // Input value handler
  const handleChange = (event) => {
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  // Touch handler
  const handleBlur = (event) => {
    setTouched((values) => ({ ...values, [event.target.name]: true }));
  };

  return {
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
  };
};

export default useForm;
