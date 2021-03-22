import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  Divider,
  FormHelperText,
  Grid,
  makeStyles,
  CircularProgress
} from '@material-ui/core';
import { useDispatch, useSelector } from 'src/store'
import Results from './Results';
import { getAddresses, createAddress, updateAddress } from 'src/slices/address'
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';

import AddressForm from 'src/components/AddressForm'

const useStyles = makeStyles((theme) => ({
  root: {}
}));

const AddressesListView = () => {
  const classes = useStyles();

  const dispatch = useDispatch()

  const accountId = useSelector(state => state.account.account?.id)

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
            Add Address FUCKER
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
                      alignItems='center'
                      container
                      justify='center'
                      spacing={2}
                    >
                      <AddressForm
                        errors={errors}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        touched={touched}
                        values={values}
                      />
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
