import React, { useState } from 'react';

import { useDispatch } from 'src/store/index'
import { useSnackbar } from 'notistack';
import moment from 'moment';

import {
  IconButton,
  Link,
  makeStyles,
  Paper,
  Popper,
  SvgIcon,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';

import { Link as RouterLink } from 'react-router-dom'

import {
  Check as CheckIcon,
  Edit2 as PencilIcon,
  Trash as TrashIcon,
  X as XIcon,
} from 'react-feather';

import { deleteProjectSpecification } from 'src/slices/projects'
import { ROOM_SPECIFICATIONS } from 'src/utils/enums'

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

const SpecificationRoom = ({ onClickEdit, projectId, specification }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null)
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

  const handleOnClickEdit = () => {
    onClickEdit(specification)
  }

  const popperIsOpen = Boolean(anchorEl)

  return (
    <>
      <TableRow hover key={specification.id}>
        <TableCell>
          <Link
            color="inherit"
            component={RouterLink}
            to={`/app/management/projects/${projectId}/specification/${specification.id}`}
            variant="h6"
          >
            {ROOM_SPECIFICATIONS.find(({ value }) => value === specification.room).label}
          </Link>
        </TableCell>
        <TableCell>
          <Typography
            variant="body2"
            color="textSecondary"
          >
            {moment(specification.updatedAt).format("MMMM YYYY")}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={(event) => handleOnClickDelete(event, specification)}>
            <SvgIcon fontSize="small">
              <TrashIcon />
            </SvgIcon>
          </IconButton>
          <IconButton onClick={handleOnClickEdit}>
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
    </>
  );
};

export default SpecificationRoom
