import React from 'react';

import { useDispatch } from 'src/store'

import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { customAlphabet } from 'nanoid';

import { updateProject } from 'src/slices/projects'

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormHelperText,
  Grid,
  TextField,
  makeStyles,
} from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';

import Page from 'src/components/Page';

import { PROJECT_STATUS, PROJECT_TYPES } from 'src/utils/enums'

const nanoid = customAlphabet('1234567890abcdef', 6)

const PROJECT_SIZES = [
  {
    label: '0-1,000 sq ft',
    value: 'sm'
  }, {
    label: '1,001-5,000 sq ft',
    value: 'md'
  },
  {
    label: '5,001-10,000 sq ft',
    value: 'lg'
  }, {
    label: '10,001+ sq ft',
    value: 'xl'
  }
];

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const Description = ({ project }) => {  
  const classes = useStyles();

  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

  if (!project) return null;

  return (
    <Page
      className={classes.root}
      title="Project description"
    >
      <Container maxWidth="lg">
        <Formik
          enableReinitialize
          initialValues={{
            code: project?.code,
            name: project?.name,
            size: project?.size,
            startDate: new Date(project?.startDate),
            status: project?.status,
            type: project?.type,
          }}
          validationSchema={Yup.object().shape({
            code: Yup.string(),
            name: Yup.string().required(),
            size: Yup.string(),
            startDate: Yup.date(),
            status: Yup.string(),
            type: Yup.string()
          })}
          onSubmit={async (values, {
            resetForm,
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              setSubmitting(true);

              await dispatch(updateProject({
                data: {
                  ...values,
                },
                projectId: project.id
              }));

              resetForm();

              setStatus({ success: true });

              setSubmitting(false);

              enqueueSnackbar('Project updated', {
                variant: 'success'
              });
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
            const handleTypeChange = e => {
              const { value } = e.target

              if (value !== values.type) {
                setFieldValue('type', value)

                let code = `N-${nanoid()}`

                if (value === 'remodel') {
                  code = `R-${nanoid()}`
                }

                setFieldValue('code', code)
              }
            }

            return (
              <form onSubmit={handleSubmit}>
                <Box mb={2}>
                  <Card>
                    <CardContent>
                      <Grid container spacing={4}>
                        <Grid
                          item
                          md={12}
                          xs={12}
                        >
                          <TextField
                            error={Boolean(touched.code && errors.code)}
                            fullWidth
                            helperText={touched.code && errors.code}
                            label="Project Code"
                            name="code"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled
                            value={values.code}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid
                          item
                          md={12}
                          xs={12}
                        >
                          <TextField
                            error={Boolean(touched.name && errors.name)}
                            fullWidth
                            helperText={touched.name && errors.name}
                            label="Project Name"
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={6} sm={12}>
                          <TextField
                            error={Boolean(touched.type && errors.type)}
                            fullWidth
                            helperText={touched.type && errors.type}
                            label="Type"
                            name="type"
                            onBlur={handleBlur}
                            onChange={handleTypeChange}
                            select
                            SelectProps={{ native: true }}
                            value={values.type}
                            variant="outlined"
                          >
                            {PROJECT_TYPES.map(({ label, value }) => (
                              <option
                                key={value}
                                value={value}
                              >
                                {label}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item md={6} sm={12}>
                          <TextField
                            error={Boolean(touched.status && errors.status)}
                            fullWidth
                            helperText={touched.status && errors.status}
                            label="Status"
                            name="status"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={values.status}
                            variant="outlined"
                          >
                            {PROJECT_STATUS.map(({ label, value }) => (
                              <option
                                key={value}
                                value={value}
                              >
                                {label}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item md={12} sm={12}>
                          <TextField
                            error={Boolean(touched.size && errors.size)}
                            fullWidth
                            helperText={touched.size && errors.size}
                            label="Size"
                            name="size"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            select
                            SelectProps={{ native: true }}
                            value={values.size}
                            variant="outlined"
                          >
                            {PROJECT_SIZES.map(({ label, value }) => (
                              <option
                                key={value}
                                value={value}
                              >
                                {label}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item sm={12}>
                          <KeyboardDatePicker
                            className={classes.datePicker}
                            label="Start Date"
                            format="MM/DD/YYYY"
                            fullWidth
                            name="startDate"
                            inputVariant="outlined"
                            value={values.startDate}
                            onBlur={() => setFieldTouched('startDate')}
                            onClose={() => setFieldTouched('startDate')}
                            onAccept={() => setFieldTouched('startDate')}
                            onChange={(date) => setFieldValue('startDate', date)}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
                {errors.submit && (
                  <Box mt={3}>
                    <FormHelperText error>
                      {errors.submit}
                    </FormHelperText>
                  </Box>
                )}
                <Box
                  display="flex"
                  justifyContent="flex-end"
                >
                  <Button
                    color="secondary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                  >
                    {isSubmitting ? <CircularProgress color='common.white' size={20} /> : 'Update'}
                  </Button>
                </Box>
              </form>
            )
          }}
        </Formik>
      </Container>
    </Page>
  );
};

export default Description
