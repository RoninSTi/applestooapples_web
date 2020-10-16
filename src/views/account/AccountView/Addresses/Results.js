import React, { useState } from 'react'

import { Link as RouterLink } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  IconButton,
  Link,
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
  CircularProgress
} from '@material-ui/core';
import {
  Check as CheckIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  X as XIcon
} from 'react-feather';
import api from 'src/utils/api'
import { useDispatch } from 'src/store'
import { getAddresses } from 'src/slices/address'

const useStyles = makeStyles((theme) => ({
  root: {},
  popper: {
    padding: theme.spacing(5, 3),
  }
}));

const Results = ({ accountId, addresses, onClickEdit }) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const [addressToDelete, setAddressToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOnClickDelete = (event, atd) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setAddressToDelete(atd)
  }

  const handleOnClickEdit = address => {
    onClickEdit(address)
  }

  const handleOnClickCancelDelete = () => {
    setAnchorEl(null)
    setAddressToDelete(null)
  }

  const handleOnClickConfirmDelete = async () => {
    setAnchorEl(null)
    setIsDeleting(true)

    try {
      await api.delete(`account/${accountId}/user/${addressToDelete.id}`)

      dispatch(getAddresses())
    } catch (error) {
      console.log({ error })
    } finally {
      setAddressToDelete(null)
      setIsDeleting(false)
    }
  }

  const popperIsOpen = Boolean(anchorEl)

  return (
    <div>
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Nickname
                </TableCell>
                <TableCell>
                  Default
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {addresses.map((address) => {
                return (
                  <TableRow
                    hover
                    key={address.id}
                  >
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                      >
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to="/app/management/users/1"
                            variant="h6"
                          >
                            {address.nickname}
                          </Link>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                          >
                            {`${address.address}${address.address2 ? ` ${address.address2}` : ''}, ${address.city}, ${address.state} ${address.postalCode}`}
                          </Typography>
                        </div>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {address.isDefault ?
                        <SvgIcon style={{ color: 'green' }} fontSize="small">
                          <CheckIcon />
                      </SvgIcon> : null}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleOnClickEdit(address)}
                      >
                          <SvgIcon fontSize="small">
                            <EditIcon />
                          </SvgIcon>
                      </IconButton>
                      <IconButton
                        disabled={isDeleting && addressToDelete?.id === address.id}
                        onClick={(event) => handleOnClickDelete(event, address)}
                      >
                        {isDeleting && addressToDelete?.id === address.id ? <CircularProgress size='sm' /> : (
                          <SvgIcon fontSize="small">
                            <TrashIcon />
                          </SvgIcon>
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Popper open={popperIsOpen} anchorEl={anchorEl}>
        <Paper className={classes.popper} elevation={1}>
          <Typography>Delete selected address?</Typography>
          <div style={{ float: 'right'}}>
            <IconButton onClick={handleOnClickCancelDelete}>
              <SvgIcon style={{ color: 'red ' }}fontSize="small">
                <XIcon />
              </SvgIcon>
            </IconButton>
            <IconButton onClick={handleOnClickConfirmDelete}>
              <SvgIcon style={{ color: 'green'}} fontSize="small">
                <CheckIcon />
              </SvgIcon>
            </IconButton>
          </div>
        </Paper>
      </Popper>
    </div>
  )
}

export default Results