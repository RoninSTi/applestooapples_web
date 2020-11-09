import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  Divider,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  TextField,
  makeStyles,
  CircularProgress
} from '@material-ui/core';
import { useDispatch, useSelector } from 'src/store'
import Results from './Results';
import { getAddresses, createAddress, updateAddress } from 'src/slices/address'
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import countries from '../General/countries'

const useStyles = makeStyles((theme) => ({
  root: {}
}));

const STATES = [
  'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA',
  'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA',
  'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
  'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT',
  'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const AddressesListView = () => {
  const classes = useStyles();

  const dispatch = useDispatch()

  const accountId = useSelector(state => state.account.activeAccount?.id)

  const addresses = useSelector(state => state.address.addresses) 

  const [addressDialogIsOpen, setAddressDialogIsOpen] = useState(false)
  const [addressToEdit, setAddressToEdit] = useState(null)

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getAddresses(accountId))
  }, [accountId, dispatch])

  const handleOnClickAddAddress = () => {
    setAddressDialogIsOpen(!addressDialogIsOpen)
  }

  const handleOnClickCancel = () => {
    setAddressToEdit(null)
    setAddressDialogIsOpen(false)
  }

  const handleOnClickEdit = address => {
    setAddressToEdit(address)
    setAddressDialogIsOpen(true)
  }

  return (
    <Card
      className={clsx(classes.root)} 
    >
      <CardHeader
        action={
          <Button
            color="secondary"
            onClick={handleOnClickAddAddress}
            variant='contained'
          >
            Add Address
          </Button>
        }
        title="Addresses"
      />
      <Divider />
      <CardContent>
        <Box mt={2} />
        <Results accountId={accountId} addresses={addresses} onClickEdit={handleOnClickEdit} />
      </CardContent>
      <Dialog open={addressDialogIsOpen}>
        <Formik
          enableReinitialize
          initialValues={{
            address: addressToEdit?.address || '',
            address2: addressToEdit?.address2 || '',
            city: addressToEdit?.city || '',
            companyName: addressToEdit?.companyName || '',
            country: addressToEdit?.country || 'US',
            name: addressToEdit?.name || '',
            postalCode: addressToEdit?.postalCode || '',
            state: addressToEdit?.state || '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            address: Yup.string(),
            address2: Yup.string(),
            city: Yup.string(),
            companyName: Yup.string(),
            country: Yup.string(),
            name: Yup.string(),
            postalCode: Yup.string(),
            state: Yup.string(),
          })}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              setSubmitting(true);
              await addressToEdit ? dispatch(updateAddress({ accountId, addressId: addressToEdit.id, data: values })) : dispatch(createAddress({ accountId, data: values }));
              setAddressDialogIsOpen(false)
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              enqueueSnackbar(addressToEdit ? 'Address updated' : 'Address created', {
                variant: 'success'
              });
              setAddressToEdit(null)
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
          }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader title='Add Address' />
                  <Divider />
                  <CardContent>
                    <Grid
                      container
                      spacing={4}
                    >
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.name && errors.name)}
                          fullWidth
                          helperText={touched.name && errors.name}
                          label="Name"
                          name="name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.name}
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
                        <TextField
                          error={Boolean(touched.address && errors.address)}
                          fullWidth
                          helperText={touched.address && errors.address}
                          label="Address"
                          name="address"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.address}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.address2 && errors.address2)}
                          fullWidth
                          helperText={touched.address2 && errors.address2}
                          label="Address Line 2"
                          name="address2"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.address2}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.city && errors.city)}
                          fullWidth
                          helperText={touched.city && errors.city}
                          label="City"
                          name="city"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.city}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid
                        item
                        md={2}
                        xs={2}
                      >
                        <TextField
                          error={Boolean(touched.state && errors.state)}
                          fullWidth
                          helperText={touched.state && errors.state}
                          label="State"
                          name="state"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={values.state}
                          variant="outlined"
                        >
                          {STATES.map((option) => (
                            <option
                              key={option}
                              value={option}
                            >
                              {option}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid
                        item
                        md={4}
                        xs={4}
                      >
                        <TextField
                          error={Boolean(touched.postalCode && errors.postalCode)}
                          fullWidth
                          helperText={touched.postalCode && errors.postalCode}
                          label="Zip Code"
                          name="postalCode"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.postalCode}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid
                        item
                        md={6}
                        xs={6}
                      >
                        <TextField
                          error={Boolean(touched.country && errors.country)}
                          fullWidth
                          helperText={touched.country && errors.country}
                          label="Country"
                          name="country"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          select
                          SelectProps={{ native: true }}
                          value={values.country}
                          variant="outlined"
                        >
                          {countries.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.text}
                            </option>
                          ))}
                        </TextField>
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
                      {isSubmitting ? <CircularProgress size='sm' /> : 
                      addressToEdit ? 'Update' : 'Add'}
                    </Button>
                  </Box>
                </Card>
              </form>
            )
          }}
        </Formik>
      </Dialog>
    </Card>
  );
};

export default AddressesListView;
