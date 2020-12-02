import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Dialog,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const COLLABORATOR_ROLES = [
  {
    label: 'Architect',
    value: 'architect',
  }, {
    label: 'Civil Engineer',
    value: 'civil',
  }, {
    label: 'Contractor',
    value: 'contractor',
  }, {
    label: 'Designer',
    value: 'designer',
  }, {
    label: 'Geotech',
    value: 'geotech',
  }, {
    label: 'Homeowner',
    value: 'homeowner',
  }, {
    label: 'Landscape Designer',
    value: 'landscape',
  }, {
    label: 'Lighting Designer',
    value: 'lighting',
  }, {
    label: 'Structural Engineer',
    value: 'structural'
  }
]

const CollaboratorInvite = ({ className, collaborators, isOpen, onCancel, onSubmit, ...rest }) => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const handleOnClickCancel = () => {
    onCancel()
  }

  const availableCollaborators = COLLABORATOR_ROLES.filter(({ value }) => !collaborators.some(({ role }) => role === value))

  return (
    <Dialog open={isOpen}>

      <Formik
        initialValues={{
          email: '',
          firstName: '',
          invite: false,
          lastName: '',
          role: availableCollaborators[0]?.value
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email('Must be a valid email')
            .max(255),
          firstName: Yup.string().required(),
          invite: Yup.boolean(),
          lastName: Yup.string().required(),
          role: Yup.string()
        })}
        onSubmit={async (values, {
          resetForm,
          setErrors,
          setStatus,
          setSubmitting
        }) => {
          try {
            resetForm();
            onSubmit({...values })
            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar('Collaborator added', {
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
                    <Grid item sm={12} md={12}>
                      <TextField
                        error={Boolean(touched.role && errors.role)}
                        fullWidth
                        helperText={touched.role && errors.role}
                        label="Role"
                        name="role"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={values.role}
                        variant="outlined"
                      >
                        {availableCollaborators.map(({ label, value }) => (
                          <option
                            key={value}
                            value={value}
                          >
                            {label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
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
                    <Grid item sm={12} md={12}>
                      <Box
                        alignItems="center"
                        display="flex"
                        mt={2}
                        ml={-1}
                      >
                      <Checkbox
                        checked={values.invite}
                        name="invite"
                        onChange={handleChange}
                      />
                      <Typography
                        variant="body2"
                        color="textSecondary"
                      >
                          Invite to ApplesTooApples as a collaborator
                      </Typography>
                        </Box>
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
                      Add Collaborator
                    </Button>
                </Box>
              </Card>
            </form>
          )}
      </Formik>
    </Dialog>
  );
};

CollaboratorInvite.propTypes = {
  className: PropTypes.string
};

export default CollaboratorInvite;
