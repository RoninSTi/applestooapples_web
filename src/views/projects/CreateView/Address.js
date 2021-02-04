import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useDispatch, useSelector } from 'src/store/index'
import { getAddresses } from 'src/slices/address'

import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';

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
import Autocomplete from '@material-ui/lab/Autocomplete';

import AddressForm from 'src/components/AddressForm'

import { ADDRESS_TYPES } from 'src/utils/enums'

const useStyles = makeStyles(() => ({
  root: {}
}));

const ADDRESS_INPUTS = [
  {
    label: 'New',
    value: 'new',
  }, {
    label: 'Existing',
    value: 'existing',
  }
]

const Address = ({ editAddress, projectAddresses, className, isOpen, onCancel, onSubmit, onSubmitEdit, ...rest }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAddresses())
  }, [dispatch])

  const addresses = useSelector(state => state.address.addresses)

  const classes = useStyles()

  const availableAddresses = ADDRESS_TYPES.filter(({ value }) => !projectAddresses.some(({ type }) => type === value))

  const handleOnClickCancel = () => {
    onCancel()
  }

  const initialValues = editAddress ?
    {
      address: editAddress?.address,
      address2: editAddress?.address2,
      city: editAddress?.city,
      companyName: editAddress?.companyName,
      country: editAddress?.country,
      id: editAddress?.id,
      input: 'edit',
      name: editAddress?.name,
      postalCode: editAddress?.postalCode,
      save: true,
      state: editAddress?.state,
      type: editAddress?.type,
    } :
    {
      address: '',
      address2: '',
      city: '',
      companyName: '',
      country: 'US',
      id: null,
      input: 'existing',
      name: '',
      postalCode: '',
      save: true,
      state: '',
      type: 'project',
    }
  
  return (
    <Dialog open={isOpen}>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          address: Yup.string(),
          address2: Yup.string(),
          city: Yup.string(),
          companyName: Yup.string(),
          country: Yup.string(),
          id: Yup.number().nullable(),
          input: Yup.string(),
          name: Yup.string().required(),
          postalCode: Yup.string(),
          save: Yup.boolean(),
          state: Yup.string(),
          type: Yup.string()
        })}
        onSubmit={async (values, {
          resetForm,
          setErrors,
          setStatus,
          setSubmitting
        }) => {
          try {
            resetForm();

            if (editAddress) {
              onSubmitEdit({
                ...values
              })
            } else {
              onSubmit({
                ...values
              })
            }
            setStatus({ success: true });
            setSubmitting(false);
            onCancel()
          } catch (err) {
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
          const handleSelectExisting = (_, existingAddress) => {
            Object.keys(existingAddress).forEach(key => {
              setFieldValue(key, existingAddress[key])
            })

            setFieldValue('save', false)
          }

          return (
            <form onSubmit={handleSubmit}>
              <Card
                className={clsx(classes.root, className)}
                {...rest}
              >
                <CardHeader title={`${editAddress ? 'Edit': 'Add'} Project Address`} />
                <Divider />
                <CardContent>
                  <Grid
                    alignItems='center'
                    container
                    justify='center'
                    spacing={2}
                  >
                    <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.type && errors.type)}
                        fullWidth
                        helperText={touched.type && errors.type}
                        label="Type"
                        name="type"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={values.type}
                        variant="outlined"
                      >
                        {availableAddresses.map(({ label, value }) => (
                          <option
                            key={value}
                            value={value}
                          >
                            {label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                    {values.input !== 'edit' && <Grid item xs={12}>
                      <TextField
                        error={Boolean(touched.input && errors.input)}
                        fullWidth
                        helperText={touched.input && errors.input}
                        label="New or existing"
                        name="input"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={values.input}
                        variant="outlined"
                      >
                        {ADDRESS_INPUTS.map(({ label, value }) => (
                          <option
                            key={value}
                            value={value}
                          >
                            {label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>}
                    {values.input === 'existing' &&
                      <Grid item xs={12}>
                        <Autocomplete
                          onChange={handleSelectExisting}
                          options={addresses}
                          getOptionLabel={(option) => option.name}
                          renderInput={(params) => <TextField {...params} label="Search existing..." variant="outlined" />}
                        />
                      </Grid>
                    }
                    {(values.input === 'new' || values.input === 'edit') &&
                      <>
                        <AddressForm
                          errors={errors}
                          handleBlur={handleBlur}
                          handleChange={handleChange}
                          touched={touched}
                          values={values}
                        />
                        <Grid item xs={12}>
                          <Box
                            alignItems="center"
                            display="flex"
                          >
                            <Checkbox
                              checked={values.save}
                              name="save"
                              onChange={handleChange}
                            />
                            <Typography
                              variant="body2"
                              color="textSecondary"
                            >
                              Save for future use
                            </Typography>
                          </Box>
                        </Grid>
                      </>
                    }
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
                    {`${editAddress ? 'Edit' : 'Add'} Address`}
                    </Button>
                </Box>
              </Card>
            </form>
          )
        }}
      </Formik>
    </Dialog>
  )
}

Address.defaultProps = {
  className: null,
  isOpen: false,
  onCancel: () => { },
  onSubmit: () => { }
}

Address.propTypes = {
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func
}

export default Address
