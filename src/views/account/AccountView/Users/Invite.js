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
  Dialog,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const typeOptions = [
  {
    value: 'architect',
    label: 'Architect'
  },
  {
    value: 'contractor',
    label: 'Contractor'
  },
  {
    value: 'designer',
    label: 'Designer'
  },
  {
    value: 'homeowner',
    label: 'Homeowner'
  },

];

const Invite = ({ className, isOpen, onCancel, ...rest }) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch()

  const account = useSelector(state => state.account.account)

  const handleOnClickCancel = () => {
    onCancel()
  }

  return (
    <Dialog open={isOpen}>

    <Formik
      initialValues={{
        email: '',
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a valid email')
          .max(255).required('Email is required'),
        firstName: Yup.string(),
        lastName: Yup.string(),
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
          onCancel()
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
                      sm={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.firstName && errors.firstName)}
                        fullWidth
                        helperText={touched.firstName && errors.firstName}
                        label="First Name"
                        name="firstName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.firstName}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid
                      item
                      sm={6}
                      xs={12}
                    >
                      <TextField
                        error={Boolean(touched.lastName && errors.lastName)}
                        fullWidth
                        helperText={touched.lastName && errors.lastName}
                        label="Last Name"
                        name="lastName"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.lastName}
                        variant="outlined"
                      />
                    </Grid>
                  <Grid
                    item
                    sm={12}
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
                </Grid>
                {errors.submit && (
                  <Box mt={3}>
                    <FormHelperText error>
                      {errors.submit}
                    </FormHelperText>
                  </Box>
                )}
                </CardContent>
                <Box
                  p={2}
                  display="flex"
                  justifyContent="flex-end"
                >
                  <Button onClick={handleOnClickCancel}>Cancel</Button>
                  <Button
                    color="secondary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                  >
                    {isSubmitting && <CircularProgress size='sm' />}
                    {' '}
                      Invite User
                    </Button>
                </Box>
            </Card>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

Invite.propTypes = {
  className: PropTypes.string
};

export default Invite;
