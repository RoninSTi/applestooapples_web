import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';
import PhoneInput from 'react-phone-number-input'
import PhoneTextField from 'src/components/PhoneInput'
import api from 'src/utils/api'
import useAuth from 'src/hooks/useAuth'

const useStyles = makeStyles(() => ({
  root: {}
}));

const GeneralSettings = ({ className, user, ...rest }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const { updateUser } = useAuth();

  return (
    <Formik
      enableReinitialize
      initialValues={{
        companyName: user.companyName || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        companyName: Yup.string(),
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        firstName: Yup.string().max(255).required('First name is required'),
        lastName: Yup.string().max(255).required('Last name is required'),
        phone: Yup.string(),
      })}
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          const response = await api({
            method: 'put',
            url: `user/${user.id}`,
            data: {
              ...values
            }
          })

          updateUser(response.data)

          resetForm();
          setStatus({ success: true });
          setSubmitting(false);
          enqueueSnackbar('Profile updated', {
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
        setFieldValue,
        touched,
        values
      }) => {
        const handlePhoneChange = number => {
          setFieldValue('phone', number, true)
        }

        return (
          <form onSubmit={handleSubmit}>
            <Card
              className={clsx(classes.root, className)}
              {...rest}
            >
              <CardHeader title="Profile" />
              <Divider />
              <CardContent>
                <Grid
                  container
                  spacing={4}
                >
                  <Grid
                    item
                    md={6}
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
                      value={values.firstName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
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
                      value={values.lastName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={12}
                    xs={12}
                  >
                    <TextField
                      error={Boolean(touched.companyName && errors.companyName)}
                      fullWidth
                      helperText={touched.companyName && errors.companyName}
                      label="Company Name"
                      name="companyName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.companyName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={12}
                    xs={12}
                  >
                    <PhoneInput
                      defaultCountry="US"
                      error={Boolean(touched.phone && errors.phone)}
                      inputComponent={PhoneTextField}
                      name='phone'
                      onBlur={handleBlur}
                      onChange={handlePhoneChange}
                      placeholder='Phone Number'
                      value={values.phone}
                    />
                  </Grid>
                  <Grid
                    item
                    md={12}
                    xs={12}
                  >
                    <TextField
                      error={Boolean(touched.email && errors.email)}
                      fullWidth
                      helperText={touched.email && errors.email ? errors.email : 'We will use this email to contact you'}
                      label="Email Address"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      required
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
              <Divider />
              <Box
                p={2}
                display="flex"
                justifyContent="flex-end"
              >
                <Button
                  color="secondary"
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                >
                  Save Changes
              </Button>
              </Box>
            </Card>
          </form>
        )
      }}
    </Formik>
  );
};

GeneralSettings.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired
};

export default GeneralSettings;
