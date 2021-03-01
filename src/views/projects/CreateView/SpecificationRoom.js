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
  PlusCircle as Add,
  X as XIcon,
} from 'react-feather';

import { createProjectSpecificationItem, deleteProjectSpecification, editProjectSpecification } from 'src/slices/projects'
import { ROOM_SPECIFICATIONS } from 'src/utils/enums'

import AddRoomModal from './AddRoomModal'
import AddSpecificationItemModal from './AddSpecificationItemModal'
import SpecificationItems from './SpecificationItems'

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
  const [editSpecificationItem, setEditSpecificationItem] = useState(null)
  const [itemIsOpen, seItemIsOpen] = useState(false)
  const [rowIsOpen, setOnClickRowIsOpen] = useState(false)
  const [specificationIsOpen, setRoomSpecificationIsOpen] = useState(false)
  const [specificationToDelete, setRoomSpecificationToDelete] = useState(null)

  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

  const handleOnClickCancelDelete = () => {
    setAnchorEl(null)
    setRoomSpecificationToDelete(null)
  }

  const handleOnClickAdd = () => {
    seItemIsOpen(true)
  }

  const handleOnClickDelete = (event, ctd) => {
    setRoomSpecificationToDelete(ctd)

    setAnchorEl(anchorEl ? null : event.currentTarget);
  }
  
  const handleOnClickEdit = (event, ea) => {
    setEditSpecificationItem(ea)

    setRoomSpecificationIsOpen(true)
  }

  const handleOnSubmitEditRoomSpecification = async data => {
    try {
      await dispatch(editProjectSpecification({
        roomSpecificationId: editSpecificationItem.id,
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
        roomSpecificationId: specificationToDelete.id,
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

  const handleOnSubmitItem = async specificationItem => {
    try {
      await dispatch(createProjectSpecificationItem({
        data: specificationItem,
        projectId,
        roomSpecificationId: specification.id
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

  const handleOnClickRowIsOpen = () => setOnClickRowIsOpen(prev => !prev)

  const handleAddRoomModalOnCancel = () => {
    setRoomSpecificationIsOpen(false);
  }

  const handleAddItemModalOnCancel = () => {
    seItemIsOpen(false);
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
          <IconButton onClick={handleOnClickAdd}>
            <SvgIcon fontSize="small">
              <Add />
            </SvgIcon>
          </IconButton>
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

      <SpecificationItems specification={specification} isOpen={rowIsOpen} />

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

      <AddSpecificationItemModal 
        isOpen={itemIsOpen} 
        onCancel={handleAddItemModalOnCancel} 
        onSubmit={handleOnSubmitItem}
      />

      <AddRoomModal 
        isOpen={specificationIsOpen} 
        editSpecificationItem={editSpecificationItem}
        onCancel={handleAddRoomModalOnCancel} 
        onSubmitEdit={handleOnSubmitEditRoomSpecification}
      />
      
    </React.Fragment>
  );
};

export default SpecificationRoom
