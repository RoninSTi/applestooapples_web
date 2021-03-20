import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';

import { useDispatch } from 'src/store'
import { getProjects } from 'src/slices/projects'

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

import { ROOM_SPECIFICATION_SOURCES, ROOM_SPECIFICATION_COPY_DEPTHS } from 'src/utils/enums'

const useStyles = makeStyles(() => ({
  root: {},
}));

const CopySpecificationModal = ({ className, isOpen, onCancel, onSubmit, projects, ...rest }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getProjects())
  }, [dispatch])

  const classes = useStyles();

  const handleOnClickCancel = () => {
    onCancel()
  }

  const initialValues = {
    depth: ROOM_SPECIFICATION_COPY_DEPTHS[0].value,
    source: 'project',
    sourceProjectId: projects[0]?.value
  }

  return projects.length > 0 ? (
    <Dialog open={isOpen}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          depth: Yup.string(),
          source: Yup.string().required(),
          sourceProjectId: Yup.number(),
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
              <CardHeader title='Copy Specification' />
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
                      error={Boolean(touched.source && errors.sourcee)}
                      fullWidth
                      helperText={touched.source && errors.source}
                      label="Source"
                      name="source"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      select
                      SelectProps={{ native: true }}
                      value={values.source}
                      variant="outlined"
                    >
                      {ROOM_SPECIFICATION_SOURCES.map(({ label, value }, i) => (
                        <option
                          key={`value-${i}`}
                          value={value}
                        >
                          {label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  {values.source === 'project' &&
                    <Grid item sm={12} md={12}>
                      <TextField
                        error={Boolean(touched.sourceProjectId && errors.sourceProjectId)}
                        fullWidth
                        helperText={touched.sourceProjectId && errors.sourceProjectId}
                        label="Projects"
                        name="sourceProjectId"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        select
                        SelectProps={{ native: true }}
                        value={values.sourceProjectId}
                        variant="outlined"
                      >
                        {projects.map(({ label, value }, i) => (
                          <option
                            key={`value-${i}`}
                            value={value}
                          >
                            {label}
                          </option>
                        ))}
                      </TextField>
                    </Grid>
                  }
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
                  Copy Specification
                </Button>
              </Box>
            </Card>
          </form>
        )}
      </Formik>
    </Dialog>
  ) : null
}

CopySpecificationModal.defaultProps = {
  className: null,
  isOpen: false,
  onCancel: () => { },
  onSubmit: () => { }
}

CopySpecificationModal.propTypes = {
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func
}

export default CopySpecificationModal
