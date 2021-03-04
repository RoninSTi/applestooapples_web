import React, { useState } from 'react';

import { useDispatch } from 'src/store/index'
import { useSnackbar } from 'notistack';

import {
  Box,
  Card,
  CardContent,
  Collapse,
  IconButton,
  makeStyles,
  Paper,
  Popper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';

import {
  Check as CheckIcon,
  Edit2 as PencilIcon,
  Trash as TrashIcon,
  X as XIcon,
} from 'react-feather';

import { deleteProjectSpecificationItem, editProjectSpecificationItem } from 'src/slices/projects'

import AddSpecificationItemModal from './AddSpecificationItemModal'

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

const SpecificationItems = ({ specification, isOpen }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null)
  const [editSpecificationItem, setEditSpecificationItem] = useState(null)
  const [itemIsOpen, seItemIsOpen] = useState(false)
  const [specificationItemToDelete, setSpecificationItemToDelete] = useState(null)

  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

  const handleOnClickCancelDelete = () => {
    setAnchorEl(null)
    setSpecificationItemToDelete(null)
  }

  const handleOnClickDelete = (event, ctd) => {
    setSpecificationItemToDelete(ctd)

    setAnchorEl(anchorEl ? null : event.currentTarget);
  }
  
  const handleOnClickEdit = (event, ea) => {
    setEditSpecificationItem(ea)

    seItemIsOpen(true)
  }

  const handleOnSubmitEditItem = async data => {
    try {
      await dispatch(editProjectSpecificationItem({
        specificationItemId: editSpecificationItem.id,
        data,
      }))

      enqueueSnackbar('Item updated', {
        variant: 'success'
      });
    } catch (err) {
      enqueueSnackbar('Item update failed', {
        variant: 'error'
      });
    }
  }

  const popperIsOpen = Boolean(anchorEl)

  const handleAddItemModalOnCancel = () => {
    seItemIsOpen(false);
  }

  return (
    <React.Fragment>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse
            in={isOpen}
            timeout="auto"
            unmountOnExit
          >
            <Box margin={1}>
              <Card>
                <CardContent>
                  <Table
                    size="small"
                    aria-label="purchases"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Comments</TableCell>
                        <TableCell>Cost</TableCell>
                        <TableCell>Currency</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Dimensions</TableCell>
                        <TableCell>Finish</TableCell>
                        <TableCell>Item</TableCell>
                        <TableCell>Manufacturer</TableCell>
                        <TableCell>Material</TableCell>
                        <TableCell>Model</TableCell>
                        <TableCell>Phase</TableCell>
                        <TableCell>Provided</TableCell>
                        <TableCell>QTY</TableCell>
                        <TableCell>U/M</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* {specification.items.map(item => (
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
                              {item.cost}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                            >
                              {item.currency}
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
                              {item.total}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton onClick={(event) => handleOnClickDelete(event, item)}>
                              <SvgIcon fontSize="small">
                                <TrashIcon />
                              </SvgIcon>
                            </IconButton>
                            <IconButton onClick={(event) => handleOnClickEdit(event, item)}>
                              <SvgIcon fontSize="small">
                                <PencilIcon />
                              </SvgIcon>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))} */}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Popper open={popperIsOpen} anchorEl={anchorEl}>
        {!!specificationItemToDelete &&
          <Paper className={classes.popper} elevation={1}>
            <Typography>Delete selected item?</Typography>
            <div style={{ float: 'right' }}>
              <IconButton onClick={handleOnClickCancelDelete}>
                <SvgIcon style={{ color: 'red ' }} fontSize="small">
                  <XIcon />
                </SvgIcon>
              </IconButton>
              <IconButton onClick={handleOnClickDeleteItem}>
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
        editSpecificationItem={editSpecificationItem}
        onCancel={handleAddItemModalOnCancel} 
        onSubmitEdit={handleOnSubmitEditItem}
      />
    </React.Fragment>
  );
};

export default SpecificationItems
