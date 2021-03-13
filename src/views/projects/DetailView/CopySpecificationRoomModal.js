import React from 'react'
import PropTypes from 'prop-types'

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
  Grid,
  FormHelperText,
  TextField,
  makeStyles
} from '@material-ui/core';

import { ROOM_SPECIFICATIONS, ROOM_SPECIFICATION_COPY_DEPTHS } from 'src/utils/enums'

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const CopySpecificationRoomModal = ({ className, isOpen, onCancel, onSubmit, ...rest }) => {
  const classes = useStyles();

  const handleOnClickCancel = () => {
    onCancel()
  }

  const initialValues = {
    depth: ROOM_SPECIFICATION_COPY_DEPTHS[0].value,
    room: ROOM_SPECIFICATIONS[0].value
  }

  return (
    <Dialog open={isOpen}>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          depth: Yup.string().required(),
          room: Yup.string().required(),
        })}
        onSubmit={async (values, {
          resetForm,
          setErrors,
          setStatus,
        }) => {
          try {
            resetForm();

            onSubmit({
              ...values
            })
            
            setStatus({ success: true });

            onCancel()
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
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
              <CardHeader title='Copy Room Specification' />
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
                      error={Boolean(touched.room && errors.room)}
                      fullWidth
                      helperText={touched.room && errors.room}
                      label="New Room"
                      name="room"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      select
                      SelectProps={{ native: true }}
                      value={values.room}
                      variant="outlined"
                    >
                      {ROOM_SPECIFICATIONS.map(({ label, value }, i) => (
                        <option
                          key={`value-${i}`}
                          value={value}
                        >
                          {label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item sm={12} md={12}>
                    <TextField
                      error={Boolean(touched.depth && errors.depth)}
                      fullWidth
                      helperText={touched.depth && errors.depth}
                      label="Copy depth"
                      name="depth"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      select
                      SelectProps={{ native: true }}
                      value={values.depth}
                      variant="outlined"
                    >
                      {ROOM_SPECIFICATION_COPY_DEPTHS.map(({ label, value }, i) => (
                        <option
                          key={`value-${i}`}
                          value={value}
                        >
                          {label}
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
                  {isSubmitting && <CircularProgress size='sm' />}
                  Copy Room
                </Button>
              </Box>
            </Card>
          </form>
        )}
      </Formik>
    </Dialog>
  )
}

CopySpecificationRoomModal.defaultProps = {
  className: null,
  isOpen: false,
  onCancel: () => { },
  onSubmit: () => { }
}

CopySpecificationRoomModal.propTypes = {
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func
}

export default CopySpecificationRoomModal
