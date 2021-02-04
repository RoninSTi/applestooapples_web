import React, { useState, useEffect } from 'react';

import { useDispatch } from 'src/store/index'
import { useSnackbar } from 'notistack';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  IconButton,
  Paper,
  Popper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  Check as CheckIcon,
  Edit2 as PencilIcon,
  Trash as TrashIcon,
  X as XIcon,
} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { ADDRESS_TYPES } from 'src/utils/enums'

import { editProjectAddress, updateProject } from 'src/slices/projects'

import Address from '../CreateView/Address';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  popper: {
    padding: theme.spacing(5, 3),
  },
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const Addresses = ({ project }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [addIsOpen, setAddIsOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState(null)
  const [editAddress, setEditAddress] = useState(null)

  useEffect(() => {
    if (project) {
      setAddresses(project?.addresses)
    }
  }, [project, setAddresses])

  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

  const handleOnClickCancelAdd = () => {
    setAddIsOpen(false)
  }

  const handleOnClickAdd = () => {
    setAddIsOpen(true)
  }

  const handleOnClickEdit = (event, ea) => {
    setEditAddress(ea)

    setAddIsOpen(true)
  }

  const handleOnClickCancelDelete = () => {
    setAnchorEl(null)
    setAddressToDelete(null)
  }

  const handleOnClickDelete = (event, atd) => {
    setAddressToDelete(atd)
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  const handleOnClickDeleteAddress = () => {
    setAddresses(prev => {
      const newAddresses = prev.filter(({ id }) => id !== addressToDelete.id)

      const data = {
        addresses: newAddresses
      }

      updateWithData({
        data,
        successMessage: 'Address deleted from project'
      })

      return newAddresses
    })

    setAnchorEl(null)
  }

  const handleOnSubmitAddAddress = address => {
    const data = {
      addresses: [
        ...addresses,
        address
      ],
    };

    updateWithData({
      data,
      successMessage: 'Address added to project'
    })
  }

  const handleOnSubmitEditAddress = async data => {
    try {
      await dispatch(editProjectAddress({
        addressId: editAddress.id,
        data,
        projectId: project.id
      }))

      enqueueSnackbar('Address updated', {
        variant: 'success'
      });
    } catch (err) {
      enqueueSnackbar('Address update failed', {
        variant: 'error'
      });
    }
  }

  const updateWithData = async ({ data, successMessage }) => {
    try {
      await dispatch(updateProject({
        data,
        projectId: project.id
      }));

      enqueueSnackbar(successMessage, {
        variant: 'success'
      });
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error'
      });
    }
  }

  const popperIsOpen = Boolean(anchorEl)

  return (
    <Page
      className={classes.root}
      title="Project addresses"
    >
      <Container maxWidth="lg">
        <Box mb={4}>
          <Card>
            <CardHeader
              action={<Button color="secondary" onClick={handleOnClickAdd}>Add Address</Button>} />
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
                                  onClick={(event) => handleOnClickDelete(event, address)}
                                >
                                  <SvgIcon fontSize="small">
                                    <TrashIcon />
                                  </SvgIcon>
                                </IconButton>
                                <IconButton
                                  onClick={(event) => handleOnClickEdit(event, address)}
                                >
                                  <SvgIcon fontSize="small">
                                    <PencilIcon />
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
      </Container>
      <Popper open={popperIsOpen} anchorEl={anchorEl}>
        {!!addressToDelete &&
          <Paper className={classes.popper} elevation={1}>
            <Typography>Delete selected address?</Typography>
            <div style={{ float: 'right' }}>
              <IconButton onClick={handleOnClickCancelDelete}>
                <SvgIcon style={{ color: 'red ' }} fontSize="small">
                  <XIcon />
                </SvgIcon>
              </IconButton>
              <IconButton onClick={handleOnClickDeleteAddress}>
                <SvgIcon style={{ color: 'green' }} fontSize="small">
                  <CheckIcon />
                </SvgIcon>
              </IconButton>
            </div>
          </Paper>
        }
      </Popper>
      <Address
        editAddress={editAddress}
        projectAddresses={addresses}
        isOpen={addIsOpen}
        onCancel={handleOnClickCancelAdd}
        onSubmit={handleOnSubmitAddAddress}
        onSubmitEdit={handleOnSubmitEditAddress}
      />
    </Page>
  );
};

export default Addresses
