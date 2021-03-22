import React, { useState } from 'react' 

import { useDispatch } from 'src/store'
import { deleteProjectSpecificationItem } from 'src/slices/projects'

import { useSnackbar } from 'notistack'

import {
  Box,
  IconButton,
  makeStyles,
  Paper,
  Popper,
  SvgIcon,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';

import {
  Check as CheckIcon,
  Edit2 as PencilIcon,
  Trash as TrashIcon,
  X as XIcon,
} from 'react-feather';

const useStyles = makeStyles((theme) => ({
  popper: {
    padding: theme.spacing(5, 3),
  },
}));

const CategoryItem = ({ category, item, onEdit }) => {
  const classes = useStyles()

  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar()

  const [anchorEl, setAnchorEl] = useState(null)

  const handleOnClickCancelDelete = () => {
    setAnchorEl(null)
  }

  const handleOnClickDelete = e => { 
    setAnchorEl(anchorEl ? null : e.currentTarget);
  }

  const handleOnClickDeleteConfirm = async () => {
    try {
      await dispatch(deleteProjectSpecificationItem({
        specificationItemId: item.id,
      }));

      enqueueSnackbar('Item deleted from project', {
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
    onEdit({
      item: {
        ...item,
        category
      }
    })
  }

  const popperIsOpen = Boolean(anchorEl)

  return (
    <>
    <TableRow key={item.id}>
      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {item.comments}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {`$ ${parseFloat(item.cost).toFixed(2)}`}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {item.description}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {item.dimensions}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {item.finish}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {item.item}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {item.manufacturer}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {item.material}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {item.model}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {item.phase}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {item.provided}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {item.qty}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
        >
          {item.um}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body2"
          color="textSecondary"
        >
        {`$ ${parseFloat(item.total).toFixed(2)}`}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Box>
          <IconButton onClick={handleOnClickDelete}>
            <SvgIcon fontSize="small">
              <TrashIcon />
            </SvgIcon>
          </IconButton>
          <IconButton onClick={handleOnClickEdit}>
            <SvgIcon fontSize="small">
              <PencilIcon />
            </SvgIcon>
          </IconButton>
        </Box>

      </TableCell>
      </TableRow>

      <Popper open={popperIsOpen} anchorEl={anchorEl}>
          <Paper className={classes.popper} elevation={1}>
            <Typography>Delete selected item?</Typography>
            <div style={{ float: 'right' }}>
              <IconButton onClick={handleOnClickCancelDelete}>
                <SvgIcon style={{ color: 'red ' }} fontSize="small">
                  <XIcon />
                </SvgIcon>
              </IconButton>
              <IconButton onClick={handleOnClickDeleteConfirm}>
                <SvgIcon style={{ color: 'green' }} fontSize="small">
                  <CheckIcon />
                </SvgIcon>
              </IconButton>
            </div>
          </Paper>
      </Popper>   
      </>
  )
}

export default CategoryItem