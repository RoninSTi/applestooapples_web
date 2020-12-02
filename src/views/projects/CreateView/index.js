import React, { useState } from 'react';

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
  IconButton,
  Link,
  StepConnector,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  colors,
  makeStyles,
  withStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { KeyboardDatePicker } from '@material-ui/pickers';

import {
  Check as CheckIcon,
  Trash as TrashIcon,
  Search as SearchIcon,
  X as XIcon
} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';

import CollaboratorInvite from './CollaboratorInvite'
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

  const [collaborators, setCollaborators] = useState([])
  const [collaboratorInviteIsOpen, setCollaboratorInviteIsOpen] = useState(false)

  const { enqueueSnackbar } = useSnackbar();

  const handleCollaboratorInviteOnCancel = () => {
    setCollaboratorInviteIsOpen(false)
  }

  const handleOnClickAddCollaborator = () => {
    setCollaboratorInviteIsOpen(true)
  }

  const handleOnClickDeleteCollaborator = (event, collaborator) => {
    event.preventDefault()

    setCollaborators(collaborators.filter(collab => collab.role !== collaborator.role))
  }

  const handleOnSubmitCollaborator = collaborator => {
    setCollaborators(prevCollaborators => [...prevCollaborators, collaborator])
  }

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
            code: nanoid(),
            name: '',
            size: 'md',
            scope: '',
            startDate: new Date(),
            type: 'new',
          }}
          validationSchema={Yup.object().shape({
            code: Yup.string(),
            name: Yup.string().required(),
            scope: Yup.string(),
            size: Yup.string(),
            startDate: Yup.date(),
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
                    <CardHeader
                      action={<Button color="secondary" onClick={handleOnClickAddCollaborator} disabled={collaborators.length === 9}>Add Collaborator</Button>}
                      title='Project Collaboration' />
                    <Divider />
                    <CardContent>
                      {collaborators.length > 0 ? (
                        <PerfectScrollbar>
                          <Box minWidth={700}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Role</TableCell>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Invited</TableCell>
                                  <TableCell align="right">Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {collaborators.map((collaborator) => {
                                  return (
                                    <TableRow
                                      hover
                                      key={collaborator.role}
                                    >
                                      <TableCell>
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                        >
                                          {collaborator.role}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Box
                                          display="flex"
                                          alignItems="center"
                                        >
                                          <div>
                                            <Typography
                                              variant="body2"
                                              color="textSecondary"
                                            >
                                              {`${collaborator.lastName}, ${collaborator.firstName}`}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="textSecondary"
                                            >
                                              {collaborator.email}
                                            </Typography>
                                          </div>
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        {collaborator.invite && <CheckIcon />}
                                      </TableCell>
                                      <TableCell align="right">
                                        <IconButton
                                          onClick={(event) => handleOnClickDeleteCollaborator(event, collaborator)}
                                        >
                                          <SvgIcon fontSize="small">
                                            <TrashIcon />
                                          </SvgIcon>
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </Box>
                        </PerfectScrollbar>) : (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                          >
                            No collaborators added.
                          </Typography>
                        )}
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
      <CollaboratorInvite
        collaborators={collaborators}
        isOpen={collaboratorInviteIsOpen}
        onCancel={handleCollaboratorInviteOnCancel}
        onSubmit={handleOnSubmitCollaborator}
      />
    </Page>
  );
};

export default ProjectCreateView;
