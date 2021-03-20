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
  PlusSquare as AddIcon,
  Send as SendIcon,
  Trash as TrashIcon,
  X as XIcon,
} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { COLLABORATOR_ROLES, INVITATION_STATUS } from 'src/utils/enums'

import { resendProjectInvite, updateProject } from 'src/slices/projects'

import CollaboratorInvite from '../CreateView/CollaboratorInvite';
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

const Collaborators = ({ project }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null)
  const [collaborators, setCollaborators] = useState([])
  const [collaboratorInviteIsOpen, setCollaboratorInviteIsOpen] = useState(false)
  const [collaboratorToDelete, setCollaboratorToDelete] = useState(null)

  useEffect(() => {
    if (project) {
      setCollaborators(project?.collaborators)
    }
  }, [project, setCollaborators])

  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

  const handleOnCancelCollaboratorInvite = () => {
    setCollaboratorInviteIsOpen(false)
  }

  const handleOnClickAddCollaborator = () => {
    setCollaboratorInviteIsOpen(true)
  }

  const handleOnClickCancelDelete = () => {
    setAnchorEl(null)
    setCollaboratorToDelete(null)
  }

  const handleOnClickDelete = (event, ctd) => {
    setCollaboratorToDelete(ctd)
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  const handleOnClickDeleteCollaborator = () => {
    setCollaborators(prevCollaborators => {
      const newCollaborators = prevCollaborators.filter(({ id }) => id !== collaboratorToDelete.id)

      const data = {
        collaborators: newCollaborators
      }

      updateWithData({
        data,
        successMessage: 'Collaborator deleted'
      })

      return newCollaborators
    })
    
    setAnchorEl(null)
  }

  const handleOnClickResend = async (_, collaborator) => {

    try {
      await dispatch(resendProjectInvite({
        collaboratorId: collaborator.id,
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

  const handleOnSubmitAddCollaborator = collaborator => {
    const data = {
      collaborators: [
        ...collaborators,
        collaborator
      ],
    };

    updateWithData({
      data,
      successMessage: 'Collaborator added'
    })
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
      title="Project collaborators"
    >
      <Container maxWidth="lg">
        <Box mb={4}>
          <Card>
            <CardHeader
              action={
                <IconButton disabled={collaborators.length === 9} onClick={handleOnClickAddCollaborator}>
                  <SvgIcon color="primary" fontSize="small">
                    <AddIcon />
                  </SvgIcon>
                </IconButton>}
              />
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
                                      {collaborator.companyName}
                                    </Typography>
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
                                <Box display='flex' justifyContent='flex-end'>
                                  <IconButton
                                    onClick={(event) => handleOnClickDelete(event, collaborator)}
                                  >
                                    <SvgIcon fontSize="small">
                                      <TrashIcon />
                                    </SvgIcon>
                                  </IconButton>
                                  <IconButton
                                    onClick={(event) => handleOnClickResend(event, collaborator)}
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
                    No collaborators added.
                  </Typography>
                )}
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Popper open={popperIsOpen} anchorEl={anchorEl}>
        {!!collaboratorToDelete &&
          <Paper className={classes.popper} elevation={1}>
            <Typography>Delete selected collaborator?</Typography>
            <div style={{ float: 'right' }}>
              <IconButton onClick={handleOnClickCancelDelete}>
                <SvgIcon style={{ color: 'red ' }} fontSize="small">
                  <XIcon />
                </SvgIcon>
              </IconButton>
              <IconButton onClick={handleOnClickDeleteCollaborator}>
                <SvgIcon style={{ color: 'green' }} fontSize="small">
                  <CheckIcon />
                </SvgIcon>
              </IconButton>
            </div>
          </Paper>
        }
      </Popper>
      <CollaboratorInvite
        collaborators={collaborators}
        isOpen={collaboratorInviteIsOpen}
        onCancel={handleOnCancelCollaboratorInvite}
        onSubmit={handleOnSubmitAddCollaborator}
      />
    </Page>
  );
};

export default Collaborators
