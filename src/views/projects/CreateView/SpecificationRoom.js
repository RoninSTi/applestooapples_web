import React, { useState } from 'react';

import { useDispatch } from 'src/store/index'
import { useSnackbar } from 'notistack';
import moment from 'moment';

import {
  IconButton,
  makeStyles,
  Paper,
  Popper,
  SvgIcon,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';

import {
  Check as CheckIcon,
  Edit2 as PencilIcon,
  Trash as TrashIcon,
  ChevronDown as CheckDown ,
  ChevronUp as CheckUp,
  X as XIcon,
} from 'react-feather';

import { deleteProjectSpecification, editProjectSpecification } from 'src/slices/projects'
import { ROOM_SPECIFICATIONS } from 'src/utils/enums'

import AddRoomModal from './AddRoomModal'

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

const SpecificationRoom = ({ projectId, specification }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null)
  const [editRoomSpecification, setEditRoomSpecification] = useState(null)
  const [specificationIsOpen, setRoomSpecificationIsOpen] = useState(false)
  const [rowIsOpen, setOnClickRowIsOpen] = useState(false)
  const [specificationToDelete, setRoomSpecificationToDelete] = useState(null)

  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

  const handleOnClickCancelDelete = () => {
    setAnchorEl(null)
    setRoomSpecificationToDelete(null)
  }

  const handleOnClickDelete = (event, ctd) => {
    setRoomSpecificationToDelete(ctd)
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }
  
  const handleOnClickEdit = (event, ea) => {
    setEditRoomSpecification(ea)

    setRoomSpecificationIsOpen(true)
  }

  const handleOnSubmitEditRoomSpecification = async data => {
    try {
      await dispatch(editProjectSpecification({
        roomRoomSpecificationRoomId: editRoomSpecification.id,
        data,
        projectId
      }))

      enqueueSnackbar('Room updated', {
        variant: 'success'
      });
    } catch (err) {
      enqueueSnackbar('Room update failed', {
        variant: 'error'
      });
    }
  }

  const handleOnClickDeleteRoomSpecification = async () => {
    try {
      await dispatch(deleteProjectSpecification({
        roomRoomSpecificationRoomId: specificationToDelete.id,
        projectId
      }));

      enqueueSnackbar('Room deleted from project ', {
        variant: 'success'
      });
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error'
      });
    }
    setAnchorEl(null)
  }

  const popperIsOpen = Boolean(anchorEl)

  const handleOnClickRowIsOpen = () => setOnClickRowIsOpen(prev => !prev)

  const handleAddRoomModalOnCancel = () => {
    setRoomSpecificationIsOpen(false);
  }

  return (
    <React.Fragment>
      <TableRow hover key={specification.id}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={handleOnClickRowIsOpen}
          >
            <SvgIcon fontSize="small">
              {rowIsOpen  ? <CheckUp /> : <CheckDown />}
            </SvgIcon>
          </IconButton>
        </TableCell>
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
            {moment(specification.date).format("MMMM YYYY")}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={(event) => handleOnClickDelete(event, specification)}>
            <SvgIcon fontSize="small">
              <TrashIcon />
            </SvgIcon>
          </IconButton>
          <IconButton onClick={(event) => handleOnClickEdit(event, specification)}>
            <SvgIcon fontSize="small">
              <PencilIcon />
            </SvgIcon>
          </IconButton>
        </TableCell>
      </TableRow>

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
              <IconButton onClick={handleOnClickDeleteRoomSpecification}>
                <SvgIcon style={{ color: 'green' }} fontSize="small">
                  <CheckIcon />
                </SvgIcon>
              </IconButton>
            </div>
          </Paper>
        }
      </Popper>
      <AddRoomModal 
        isOpen={specificationIsOpen} 
        editRoomSpecification={editRoomSpecification}
        onCancel={handleAddRoomModalOnCancel} 
        onSubmitEdit={handleOnSubmitEditRoomSpecification}
      />
      
    </React.Fragment>
  );
};

export default SpecificationRoom
