import React, { useState } from 'react';

import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useDispatch } from 'src/store/index'

import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { customAlphabet } from 'nanoid';

import { createProject } from 'src/slices/projects'

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
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { KeyboardDatePicker } from '@material-ui/pickers';

import {
  Trash as TrashIcon,
} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Address from './Address'
import CollaboratorInvite from './CollaboratorInvite'
import DraftEditor from 'src/components/DraftEditor'
import Page from 'src/components/Page';

import { ADDRESS_TYPES, COLLABORATOR_ROLES, INVITATION_STATUS, PROJECT_TYPES } from 'src/utils/enums'

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

const ProjectCreateView = () => {
  const classes = useStyles();

  const history = useHistory()

  const [addresses, setAddresses] = useState([])
  const [addressIsOpen, setAddressIsOpen] = useState(false)

  const [collaborators, setCollaborators] = useState([])
  const [collaboratorInviteIsOpen, setCollaboratorInviteIsOpen] = useState(false)

  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

  const handleAddressCancel = () => {
    setAddressIsOpen(false)
  }

  const handleCollaboratorInviteOnCancel = () => {
    setCollaboratorInviteIsOpen(false)
  }

  const handleOnClickAddAddress = () => {
    setAddressIsOpen(true)
  }

  const handleOnClickAddCollaborator = () => {
    setCollaboratorInviteIsOpen(true)
  }

  const handleOnClickDeleteAddress = (event, address) => {
    event.preventDefault()

    setAddresses(addresses.filter(add => add.type !== address.type))
  }

  const handleOnClickDeleteCollaborator = (event, collaborator) => {
    event.preventDefault()

    setCollaborators(collaborators.filter(collab => collab.role !== collaborator.role))
  }

  const handleOnSubmitAddress = address => {
    setAddresses(prevAddresses => [...prevAddresses, address])
  }

  const handleOnSubmitCollaborator = collaborator => {
    setCollaborators(prevCollaborators => [...prevCollaborators, collaborator])

    enqueueSnackbar('Collaborator added', {
      variant: 'success'
    });
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
          initialValues={{
            code: `N-${nanoid()}`,
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
              await dispatch(createProject({
                data: {
                  ...values,
                  addresses,
                  collaborators
                },
                history
              }))
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
                                  <TableCell>Invitation status</TableCell>
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
                                          {COLLABORATOR_ROLES.find(({ value }) => value === collaborator.role).label}
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
                                        {INVITATION_STATUS.find(({ value }) => value === collaborator.invitationStatus).label}
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
                    <CardHeader
                      action={<Button color="secondary" onClick={handleOnClickAddAddress}>Add Address</Button>}
                      title='Project Addresses'
                    />
                    <Divider />
                    <CardContent>
                      {addresses.length > 0 ? (
                        <PerfectScrollbar>
                          <Box minWidth={700}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Type</TableCell>
                                  <TableCell>Address</TableCell>
                                  <TableCell align="right">Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {addresses.map((address) => {
                                  return (
                                    <TableRow
                                      hover
                                      key={address.type}
                                    >
                                      <TableCell>
                                        <Typography
                                          variant="body2"
                                          color="textSecondary"
                                        >
                                          {ADDRESS_TYPES.find(({ value }) => value === address.type).label}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Box
                                          alignItems="flex-start"
                                          display="flex"
                                          flexDirection="column"
                                        >
                                            <Typography
                                              variant="h6"
                                            >
                                              {address.name}
                                            </Typography>
                                            <Typography
                                              variant="h5"
                                            >
                                              {address.companyName}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="textSecondary"
                                            >
                                              {`${address.address}${address.address2 ? ` ${address.address2}` : ''}, ${address.city}, ${address.state} ${address.postalCode}`}
                                            </Typography>
                                        </Box>
                                      </TableCell>
                                      <TableCell align="right">
                                        <IconButton
                                          onClick={(event) => handleOnClickDeleteAddress(event, address)}
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
                            No addresses added.
                          </Typography>
                        )}
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
                  <Button onClick={handleOnClickCancel}>Reset</Button>
                  <Button
                    color="secondary"
                    type="submit"
                    variant="contained"
                  >
                    {isSubmitting ? <CircularProgress color='common.white' size={20} /> : 'Create'}
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
      <Address
        projectAddresses={addresses}
        isOpen={addressIsOpen}
        onCancel={handleAddressCancel}
        onSubmit={handleOnSubmitAddress}
      />
    </Page>
  );
};

export default ProjectCreateView
