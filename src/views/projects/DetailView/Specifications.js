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
  Send as SendIcon,
  Trash as TrashIcon,
  X as XIcon,
} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { COLLABORATOR_ROLES, INVITATION_STATUS } from 'src/utils/enums'

import { resendProjectInvite, updateProject } from 'src/slices/projects'

import AddRoomModal from './AddRoomModal';
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
  const [specifications, setSpecifications] = useState([])
  const [roomSpecificationIsOpen, setRoomSpecificationIsOpen] = useState(false)
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

  const handleOnClickDeleteSpecification = () => {
    setSpecifications(prevSpecifications => {
      const newSpecifications = prevSpecifications.filter(({ id }) => id !== specificationToDelete.id)

      const data = {
        specifications: newSpecifications
      }

      updateWithData({
        data,
        successMessage: 'Specification deleted'
      })

      return newSpecifications
    })
    
    setAnchorEl(null)
  }

  const handleOnClickResend = async (_, specification) => {

    try {
      await dispatch(resendProjectInvite({
        specificationId: specification.id,
        projectId: project.id
      }))

      enqueueSnackbar('Invite resent', {
        variant: 'success'
      })
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error'
      })
    }
  }

  const handleOnSubmitRoomSpecification = specification => {
    console.log('specification', specification)
    // const data = {
    //   specifications: [
    //     ...specifications,
    //     specification
    //   ],
    // };

    // updateWithData({
    //   data,
    //   successMessage: 'Specification added'
    // })
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
                          <TableCell>Role</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Invitation status</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {specifications.map((specification) => {
                          return (
                            <TableRow
                              hover
                              key={specification.role}
                            >
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {COLLABORATOR_ROLES.find(({ value }) => value === specification.role).label}
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
                                      {`${specification.lastName}, ${specification.firstName}`}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                    >
                                      {specification.email}
                                    </Typography>
                                  </div>
                                </Box>
                              </TableCell>
                              <TableCell>
                                {INVITATION_STATUS.find(({ value }) => value === specification.invitationStatus).label}
                              </TableCell>
                              <TableCell align="right">
                                <Box display='flex' justifyContent='flex-end'>
                                  <IconButton
                                    onClick={(event) => handleOnClickDelete(event, specification)}
                                  >
                                    <SvgIcon fontSize="small">
                                      <TrashIcon />
                                    </SvgIcon>
                                  </IconButton>
                                  <IconButton
                                    onClick={(event) => handleOnClickResend(event, specification)}
                                  >
                                    <SvgIcon fontSize="small">
                                      <SendIcon />
                                    </SvgIcon>
                                  </IconButton>
                                </Box>
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
        onCancel={handleAddRoomModalOnCancel} 
        onSubmit={handleOnSubmitRoomSpecification}
        projectId={project.id} />
    </Page>
  );
};

export default Specifications
