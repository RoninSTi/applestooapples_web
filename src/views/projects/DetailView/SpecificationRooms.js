import React, { useState } from 'react'

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';

import { useDispatch } from 'react-redux'
import { createProjectSpecification, editProjectSpecification } from '../../../slices/projects'

import { useSnackbar } from 'notistack';

import PerfectScrollbar from 'react-perfect-scrollbar';

import AddRoomModal from './AddRoomModal'
import SpecificationRoom from './SpecificationRoom'

const SpecificationRooms = ({ specifications, projectId }) => {
  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

  const [roomSpecificationIsOpen, setRoomSpecificationIsOpen] = useState(false)
  const [editSpecificationRoom, setEditSpecificationRoom] = useState(null)

  const handleOnClickAddRoomSpecification = () => {
    setRoomSpecificationIsOpen(true)
  }

  const handleOnClickEditRoomSpecification = (er) => {
    setEditSpecificationRoom(er)

    setRoomSpecificationIsOpen(true)
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

  return (
    <>
    <Card>
      <CardHeader
        action={<Button color="secondary" onClick={handleOnClickAddRoomSpecification}>Add Room</Button>} />
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
            <Typography
              variant="body2"
              color="textSecondary"
            >
              No specifications added.
            </Typography>
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
    </>
  )
}

export default SpecificationRooms
