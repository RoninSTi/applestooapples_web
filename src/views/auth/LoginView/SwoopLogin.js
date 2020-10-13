import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import {
  Box,
  Button,
  FormHelperText,
  makeStyles
} from '@material-ui/core';
import useAuth from 'src/hooks/useAuth';
import useIsMountedRef from 'src/hooks/useIsMountedRef';

const useStyles = makeStyles(() => ({
  root: {}
}));

const SwoopLogin = ({ className, ...rest }) => {
  const classes = useStyles();
  const { magic } = useAuth();
  const isMountedRef = useIsMountedRef();

  console.log({ magic })

  return (
    <Formik
      initialValues={{
        submit: null
      }}
      onSubmit={async (values, {
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          magic();

          if (isMountedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err) {
          console.error(err);
          if (isMountedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
          <form
            noValidate
            onSubmit={handleSubmit}
            className={clsx(classes.root, className)}
            {...rest}
          >
            {errors.submit && (
              <Box mt={3}>
                <FormHelperText error>
                  {errors.submit}
                </FormHelperText>
              </Box>
            )}
            <Box mt={2}>
              <Button
                color="secondary"
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Log In
            </Button>
            </Box>
          </form>
        )}
    </Formik>
  );
};

SwoopLogin.propTypes = {
  className: PropTypes.string,
};

export default SwoopLogin;
