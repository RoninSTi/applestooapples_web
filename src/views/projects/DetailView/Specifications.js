import React, { useState, useEffect } from 'react';

import { useDispatch } from 'src/store/index'
import { useSnackbar } from 'notistack';
import moment from 'moment';

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

import { createProjectSpecification, deleteProjectSpecification, editProjectSpecification } from 'src/slices/projects'
import { ROOM_SPECIFICATIONS } from 'src/utils/enums'

import AddRoomModal from '../CreateView/AddRoomModal'
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

const Specifications = ({ project }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null)
  const [editSpecification, setEditSpecification] = useState(null)
  const [roomSpecificationIsOpen, setRoomSpecificationIsOpen] = useState(false)
  const [specifications, setSpecifications] = useState([])
  const [specificationToDelete, setSpecificationToDelete] = useState(null)


  useEffect(() => {
    if (project) {
      setSpecifications(project?.specifications)
    }
  }, [project, setSpecifications])

  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

  const handleOnClickAddRoomSpecification = () => {
    setRoomSpecificationIsOpen(true)
  }

  const handleOnClickCancelDelete = () => {
    setAnchorEl(null)
    setSpecificationToDelete(null)
  }

  const handleOnClickDelete = (event, ctd) => {
    setSpecificationToDelete(ctd)
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }
  
  const handleOnClickEdit = (event, ea) => {
    setEditSpecification(ea)

    setRoomSpecificationIsOpen(true)
  }

  const handleOnSubmitEditSpecification = async data => {
    try {
      await dispatch(editProjectSpecification({
        roomSpecificationId: editSpecification.id,
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

  const handleOnClickDeleteSpecification = async () => {
    try {
      await dispatch(deleteProjectSpecification({
        roomSpecificationId: specificationToDelete.id,
        projectId: project.id
      }));

      enqueueSnackbar('Address deleted from project', {
        variant: 'success'
      });
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error'
      });
    }
    setAnchorEl(null)
  }

  const handleOnSubmitRoomSpecification = async specification => {
      try {
        await dispatch(createProjectSpecification({
          data: specification,
          projectId: project.id
        }));

        enqueueSnackbar('Address added to project', {
          variant: 'success'
        });
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error'
      });
    }
  }

  const popperIsOpen = Boolean(anchorEl)

  const handleAddRoomModalOnCancel = () => {
    setRoomSpecificationIsOpen(false);
  }

  return (
    <Page
      className={classes.root}
      title="Specifications"
    >
      <Container maxWidth="lg">
        <Box mb={4}>
          <Card>
            <CardHeader
              action={<Button color="secondary" onClick={handleOnClickAddRoomSpecification} disabled={specifications.length === 9}>Add A Room Specification</Button>} />
            <Divider />
            <CardContent>
              {specifications.length > 0 ? (
                <PerfectScrollbar>
                  <Box minWidth={700}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Room</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {specifications.map((specification) => {
                          return (
                            <TableRow
                              hover
                              key={specification.id}
                            >
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {ROOM_SPECIFICATIONS.find(({ value }) => value === specification.room).label}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {moment(specification.date).format('MMMM YYYY')}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  onClick={(event) => handleOnClickDelete(event, specification)}
                                >
                                  <SvgIcon fontSize="small">
                                    <TrashIcon />
                                  </SvgIcon>
                                </IconButton>
                                <IconButton
                                  onClick={(event) => handleOnClickEdit(event, specification)}
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
                    No specifications added.
                  </Typography>
                )}
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Popper open={popperIsOpen} anchorEl={anchorEl}>
        {!!specificationToDelete &&
          <Paper className={classes.popper} elevation={1}>
            <Typography>Delete selected specification?</Typography>
            <div style={{ float: 'right' }}>
              <IconButton onClick={handleOnClickCancelDelete}>
                <SvgIcon style={{ color: 'red ' }} fontSize="small">
                  <XIcon />
                </SvgIcon>
              </IconButton>
              <IconButton onClick={handleOnClickDeleteSpecification}>
                <SvgIcon style={{ color: 'green' }} fontSize="small">
                  <CheckIcon />
                </SvgIcon>
              </IconButton>
            </div>
          </Paper>
        }
      </Popper>
      <AddRoomModal 
        isOpen={roomSpecificationIsOpen} 
        editSpecification={editSpecification}
        onCancel={handleAddRoomModalOnCancel} 
        onSubmit={handleOnSubmitRoomSpecification}
        onSubmitEdit={handleOnSubmitEditSpecification}
      />
    </Page>
  );
};

export default Specifications
