import React, { useState } from 'react'

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';

import {
  PlusSquare as AddIcon,
  Copy as CopyIcon,
} from 'react-feather';

import { useDispatch, useSelector } from 'react-redux'
import { createSpecificationFromSource, createProjectSpecification, editProjectSpecification } from 'src/slices/projects'

import { useSnackbar } from 'notistack';

import PerfectScrollbar from 'react-perfect-scrollbar';

import AddRoomModal from './AddRoomModal'
import CopySpecificationModal from './CopySpecificationModal';
import SpecificationRoom from './SpecificationRoom'

const SpecificationRooms = ({ specifications, projectId }) => {
  const dispatch = useDispatch()

  const projects = useSelector(state => state.projects.projects.map(project => ({
    label: project.name,
    value: project.id
  })).filter(({ value }) => value !== projectId))

  const { enqueueSnackbar } = useSnackbar();

  const [copySpecificationIsOpen, setCopySpecificationIsOpen] = useState(false)
  const [roomSpecificationIsOpen, setRoomSpecificationIsOpen] = useState(false)
  const [editSpecificationRoom, setEditSpecificationRoom] = useState(null)

  const handleOnClickCopyRoomSpecification = () => {
    setCopySpecificationIsOpen(true)
  }

  const handleOnClickAddRoomSpecification = () => {
    setRoomSpecificationIsOpen(true)
  }

  const handleOnClickEditRoomSpecification = (er) => {
    setEditSpecificationRoom(er)

    setRoomSpecificationIsOpen(true)
  }

  const handleOnSubmitCopyRoomSpecification = async data => {
    try {
      await dispatch(createSpecificationFromSource({
        data,
        projectId
      }))
        
      enqueueSnackbar('Specification added', {
        variant: 'success'
      });
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error'
      });
    }
  }

  const handleOnSubmitRoomSpecification = async specification => {
    try {
      await dispatch(createProjectSpecification({
        data: specification,
        projectId
      }));

      enqueueSnackbar('Room added to specification', {
        variant: 'success'
      });
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error'
      });
    }
  }

  const handleOnSubmitEditRoomSpecification = async specification => {
    try {
      await dispatch(editProjectSpecification({
        data: specification,
        roomSpecificationId: editSpecificationRoom.id
      }));

      setEditSpecificationRoom(null)

      enqueueSnackbar('Room specification updated', {
        variant: 'success'
      });
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error'
      });
    }
  }

  const handleAddRoomModalOnCancel = () => {
    setEditSpecificationRoom(null);

    setRoomSpecificationIsOpen(false);
  }

  const handleCopySpecificationModalOnCancel = () => {
    setCopySpecificationIsOpen(false);
  }

  return (
    <>
    <Card>
      <CardHeader
          action={
            <Box>
              {specifications.length === 0 &&
                <IconButton onClick={handleOnClickCopyRoomSpecification}>
                  <SvgIcon color="primary" fontSize="small">
                    <CopyIcon />
                  </SvgIcon>
                </IconButton>
              }
              <IconButton onClick={handleOnClickAddRoomSpecification}>
                <SvgIcon color="primary" fontSize="small">
                  <AddIcon />
                </SvgIcon>
              </IconButton>
              </Box>} />
      <Divider />
      <CardContent>
        {specifications.length > 0 ? (
          <PerfectScrollbar>
            <Box minWidth={700}>
              <TableContainer>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Room</TableCell>
                      <TableCell>Last Updated </TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {specifications.map((specification) => (
                      <SpecificationRoom
                        key={`specification-${specification.id}`}
                        onClickEdit={handleOnClickEditRoomSpecification}
                        projectId={projectId}
                        specification={specification} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            </PerfectScrollbar>) : (
              <Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                >
                  No specifications added.
              </Typography>
              </Box>
          )}
      </CardContent>

      </Card>
      <AddRoomModal
        editSpecificationRoom={editSpecificationRoom}
        isOpen={roomSpecificationIsOpen}
        onCancel={handleAddRoomModalOnCancel}
        onSubmit={handleOnSubmitRoomSpecification}
        onSubmitEdit={handleOnSubmitEditRoomSpecification}
      />
      <CopySpecificationModal
        isOpen={copySpecificationIsOpen}
        onCancel={handleCopySpecificationModalOnCancel}
        onSubmit={handleOnSubmitCopyRoomSpecification}
        projects={projects}
      />
    </>
  )
}

export default SpecificationRooms
