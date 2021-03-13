import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useDispatch } from 'src/store/index'
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
  CircularProgress,
  Dialog,
  Divider,
  FormHelperText,
  Grid,
  makeStyles
} from '@material-ui/core';

import {
  CATEGORIES,
  PHASES,
  PROVIDED
} from 'src/utils/enums'

import SpecificationItemForm from 'src/components/SpecificationItemForm';

const useStyles = makeStyles(() => ({
  root: {}
}));


const AddSpecificationItemModal = ({ editSpecificationItem, className, isOpen, onCancel, onSubmit, onSubmitEdit, ...rest }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAddresses())
  }, [dispatch])

  const classes = useStyles()

  const handleOnClickCancel = () => {
    onCancel()
  }

  const initialValues = editSpecificationItem ?
    {
      comments: editSpecificationItem?.comments,
      cost: editSpecificationItem?.cost,
      currency: editSpecificationItem?.currency,
      description: editSpecificationItem?.description,
      dimensions: editSpecificationItem?.dimensions,
      finish: editSpecificationItem?.finish,
      item: editSpecificationItem?.item,
      manufacturer: editSpecificationItem?.manufacturer,
      category: editSpecificationItem?.category,
      model: editSpecificationItem?.model,
      phase: editSpecificationItem?.phase,
      provided: editSpecificationItem?.provided,
      qty: editSpecificationItem?.qty,
      total: editSpecificationItem?.total,
      um: editSpecificationItem?.um
    } :
    {
      comments: '',
      cost: 0,
      currency: 'USD',
      description: '',
      dimensions: '',
      finish: '',
      item: '',
      manufacturer: '',
      category: CATEGORIES[0].value,
      model: '',
      phase: PHASES[0].value,
      provided: PROVIDED[0].value,
      qty: 0,
      total: 0,
      um: ''
    }
  
  return (
    <Dialog open={isOpen}>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          category: Yup.string(),
          comments: Yup.string(),
          cost: Yup.number(),
          currency: Yup.string(),
          description: Yup.string(),
          dimensions: Yup.string(),
          finish: Yup.string(),
          item: Yup.string(),
          manufacturer: Yup.string(),
          model: Yup.string(),
          phase: Yup.string(),
          provided: Yup.string(),
          qty: Yup.number(),
          total: Yup.number(),
          um: Yup.string()
        })}
        onSubmit={async (values, {
          resetForm,
          setErrors,
          setStatus,
          setSubmitting
        }) => {
          try {
            resetForm();

            if (editSpecificationItem) {
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
          setFieldTouched,
          setFieldValue,
          touched,
          values
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Card
                className={clsx(classes.root, className)}
                {...rest}
              >
                <CardHeader title={`${editSpecificationItem ? 'Edit': 'Add'} Item`} />
                <Divider />
                <CardContent>
                  <Grid
                    alignItems='center'
                    container
                    justify='center'
                    spacing={2}
                  >
                     <SpecificationItemForm
                        errors={errors}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        setFieldTouched={setFieldTouched}
                        setFieldValue={setFieldValue}
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
                    {isSubmitting && <CircularProgress size='sm' />}
                    {`${editSpecificationItem ? 'Edit' : 'Add'} Item`}
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

AddSpecificationItemModal.defaultProps = {
  className: null,
  isOpen: false,
  onCancel: () => { },
  onSubmit: () => { }
}

AddSpecificationItemModal.propTypes = {
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func
}

export default AddSpecificationItemModal
