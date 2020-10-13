import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'src/store'
import { inviteUser } from 'src/slices/account';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Invite = ({ className, ...rest }) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch()

  const account = useSelector(state => state.account.activeAccount)

  return (
    <Formik
      initialValues={{
        email: '',
        role: 'super-admin',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email')
          .max(255).required('Email is required'),
        role: Yup.string()
          .required('Required')
      })}
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          await dispatch(inviteUser(values, account?.id));
          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('User invited', {
            variant: 'success'
          });
        } catch (err) {
          console.error(err);
          setStatus({ success: false });
          setErrors({ submit: err.message });
          setSubmitting(false);
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
          <form onSubmit={handleSubmit}>
            <Card
              className={clsx(classes.root, className)}
              {...rest}
            >
              <CardHeader title="Invite User" />
              <Divider />
              <CardContent>
                <Grid
                  alignItems='center'
                  container
                  justify='center'
                  spacing={2}
                >
                  <Grid
                    item
                    sm={10}
                    xs={12}
                  >
                    <TextField
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.password && errors.password}
                      label="Email"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="email"
                      value={values.email}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item sm={2} xs={12}>
                    <Button
                      color="secondary"
                      disabled={isSubmitting}
                      type="submit"
                      variant="contained"
                    >
                      {isSubmitting && <CircularProgress size='sm'/>}
                      {' '}
                      Invite User
                    </Button>
                  </Grid>
                </Grid>
                {errors.submit && (
                  <Box mt={3}>
                    <FormHelperText error>
                      {errors.submit}
                    </FormHelperText>
                  </Box>
                )}
              </CardContent>
            </Card>
          </form>
        )}
    </Formik>
  );
};

Invite.propTypes = {
  className: PropTypes.string
};

export default Invite;
