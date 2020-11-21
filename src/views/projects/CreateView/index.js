import React from 'react';

import { Link as RouterLink } from 'react-router-dom';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { nanoid } from 'nanoid'
import { useSnackbar } from 'notistack';

import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  FormHelperText,
  Grid,
  Link,
  StepConnector,
  TextField,
  Typography,
  colors,
  makeStyles,
  withStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { KeyboardDatePicker } from '@material-ui/pickers';


import DraftEditor from 'src/components/DraftEditor'
import Page from 'src/components/Page';

const PROJECT_TYPES = [
  {
    label: 'New',
    value: 'new'
  }, {
    label: 'Remodel',
    value: 'remodel'
  }
];

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

const ProjectCreateView = () => {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  return (
    <Page
      className={classes.root}
      title="Project Create"
    >
      <Container maxWidth="lg">
        <Box mb={3}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link
              variant="body1"
              color="inherit"
              to="/app"
              component={RouterLink}
            >
              Dashboard
            </Link>
            <Typography
              variant="body1"
              color="textPrimary"
            >
              Projects
            </Typography>
          </Breadcrumbs>
          <Typography
            variant="h3"
            color="textPrimary"
          >
            Create Project
          </Typography>
        </Box>
        <Formik
          enableReinitialize
          initialValues={{
            architectName: '',
            civilName: '',
            code: nanoid(),
            contractorName: '',
            designerName: '',
            homeownerName: '',
            geotechName: '',
            landscapeName: '',
            lightingName: '',
            name: '',
            size: 'md',
            scope: '',
            startDate: new Date(),
            structuralName: '',
            type: 'new',
          }}
          validationSchema={Yup.object().shape({
            architectName: Yup.string(),
            civilName: Yup.string(),
            code: Yup.string(),
            contractorName: Yup.string(),
            designerName: Yup.string(),
            geotechName: Yup.string(),
            homeownerName: Yup.string(),
            landscapeName: Yup.string(),
            lightingName: Yup.string(),
            name: Yup.string().required(),
            scope: Yup.string(),
            size: Yup.string(),
            startDate: Yup.date(),
            structuralName: Yup.string(),
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
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              enqueueSnackbar('Project created', {
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
            resetForm,
            setFieldTouched,
            setFieldValue,
            touched,
            values
          }) => {
            const handleOnClickCancel = () => {
              resetForm()
            }

            const handleOnContentStateChange = contentState => {
              setFieldValue('scope', JSON.stringify(contentState))
            }

            return (

              <form onSubmit={handleSubmit}>
                <Box mb={4}>

                <Card>
                  <CardHeader title='Project Description' />
                  <Divider />
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
                      <Grid item md={12} sm={12}>
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
                <Box mb={4}>
                  <Card>
                    <CardHeader title='Project Collaboration' />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          <TextField
                            error={Boolean(touched.homeownerName && errors.homeownerName)}
                            fullWidth
                            helperText={touched.homeownerName && errors.homeownerName}
                            label="Homeowner Name"
                            name="homeownerName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.homeownerName}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            error={Boolean(touched.architectName && errors.architectName)}
                            fullWidth
                            helperText={touched.architectName && errors.architectName}
                            label="Architect Name"
                            name="architectName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.architectName}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            error={Boolean(touched.contractorName && errors.contractorName)}
                            fullWidth
                            helperText={touched.contractorName && errors.contractorName}
                            label="Contractor Name"
                            name="contractorName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.contractorName}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            error={Boolean(touched.designerName && errors.designerName)}
                            fullWidth
                            helperText={touched.designerName && errors.designerName}
                            label="Designer Name"
                            name="designerName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.designerName}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            error={Boolean(touched.landscapeName && errors.landscapeName)}
                            fullWidth
                            helperText={touched.landscapeName && errors.landscapeName}
                            label="Landscape Designer Name"
                            name="landscapeName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.landscapeName}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            error={Boolean(touched.structuralName && errors.structuralName)}
                            fullWidth
                            helperText={touched.structuralName && errors.structuralName}
                            label="Structural Engineer Name"
                            name="structuralName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.structuralName}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            error={Boolean(touched.geotechName && errors.geotechName)}
                            fullWidth
                            helperText={touched.geotechName && errors.geotechName}
                            label="Geotech Name"
                            name="geotechName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.geotechName}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            error={Boolean(touched.civilName && errors.civilName)}
                            fullWidth
                            helperText={touched.civilName && errors.civilName}
                            label="Civil Engineer Name"
                            name="civilName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.civilName}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            error={Boolean(touched.lightingName && errors.lightingName)}
                            fullWidth
                            helperText={touched.lightingName && errors.lightingName}
                            label="Lighting Designer Name"
                            name="lightingName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.lightingName}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Box>
                <Box mb={4}>
                  <Card>
                    <CardHeader title='Project Addresses' />
                    <Divider />
                    <CardContent>
                      <Typography
                        variant="h4"
                        color="textPrimary"
                      >
                        Need Address UX discussion
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                <Box>
                  <Card>
                    <CardHeader title='Project Scope' />
                    <Divider />
                    <CardContent>
                      <Grid container spacing={4}>
                        <Grid item sm={12} md={12}>
                          <DraftEditor onContentStateChange={handleOnContentStateChange} />
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
                  p={2}
                  display="flex"
                  justifyContent="flex-end"
                  mt={4}
                >
                  <Button onClick={handleOnClickCancel}>Cancel</Button>
                  <Button
                    color="secondary"
                    disabled={isSubmitting}
                    type="submit"
                    variant="contained"
                  >
                    {isSubmitting ? <CircularProgress size='sm' /> :
                      'Create'}
                  </Button>
                </Box>
            </form>
          )}}
          </Formik>
      </Container>
    </Page>
  );
};

export default ProjectCreateView;
