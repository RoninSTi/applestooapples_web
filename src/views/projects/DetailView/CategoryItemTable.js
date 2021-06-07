import React, { useEffect, useState } from 'react'

import { useDispatch } from 'src/store'
import { deleteProjectSpecificationItem } from 'src/slices/projects'

import { useSnackbar } from 'notistack'

import { useTable } from 'react-table'

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemText,
  makeStyles,
  MenuItem,
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

const useStyles = makeStyles((theme) => ({
  cell: {
    whiteSpace: 'nowrap'
  },
  popper: {
    padding: theme.spacing(5, 3),
  },
}))

const CategoryItemTable = ({ category, columns, data, initialCols, isOpen, onClose, onEdit }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    allColumns,
    visibleColumns
  } = useTable({
    columns,
    data,
    initialState: {
      hiddenColumns: initialCols
    }
  })

  useEffect(() => {
    const colIds = visibleColumns.map(({ id }) => id)

    window.localStorage.setItem(`${category.toUpperCase()}-COLS`, JSON.stringify(colIds))
  }, [category, visibleColumns])

  const classes = useStyles()

  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar()

  const handleOnClickCancelDelete = () => {
    setAnchorEl(null)
    setItemToDelete(null)
  }

  const handleOnClickDelete = (e, item) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
    setItemToDelete(item)
  }

  const handleOnClickDeleteConfirm = async () => {
    try {
      await dispatch(deleteProjectSpecificationItem({
        specificationItemId: itemToDelete.id,
      }));

      enqueueSnackbar('Item deleted from project', {
        variant: 'success'
      });
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error'
      });
    } finally {
      setItemToDelete(null)
    }

    setAnchorEl(null)
  }

  const handleOnClickEdit = item => {
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
      <Table size="small" aria-label="category" {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell className={classes.cell} {...column.getHeaderProps()}>{column.render('Header')}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  switch (cell.column.id) {
                    case 'item':
                      return (
                        <TableCell {...cell.getCellProps()} className={classes.cell}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                          >
                            {cell.row.original.item === 'Other' ? cell.row.original.item2 : cell.row.original.item}
                          </Typography>
                        </TableCell>
                      )
                    case 'cost':
                    case 'total':
                      return (
                        <TableCell {...cell.getCellProps()} className={classes.cell}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                          >
                            {`$${parseFloat(cell.row.original[cell.column.id]).toFixed(2)}`}
                          </Typography>
                        </TableCell>
                      )
                    case 'actions':
                      return (
                        <TableCell {...cell.getCellProps()} align="right" className={classes.cell}>
                          <Box>
                            <IconButton onClick={e => handleOnClickDelete(e, cell.row.original)}>
                              <SvgIcon fontSize="small">
                                <TrashIcon />
                              </SvgIcon>
                            </IconButton>
                            <IconButton onClick={() => handleOnClickEdit(cell.row.original)}>
                              <SvgIcon fontSize="small">
                                <PencilIcon />
                              </SvgIcon>
                            </IconButton>
                          </Box>
                        </TableCell>
                      )
                    default:
                      return (
                        <TableCell {...cell.getCellProps()} className={classes.cell}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                          >
                            {cell.render('Cell')}
                          </Typography>
                        </TableCell>
                      )
                  }
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <Dialog disableBackdropClick disableEscapeKeyDown open={isOpen} onClose={onClose}>
        <DialogTitle>Select Visible Columns</DialogTitle>
        <DialogContent>
          {
            allColumns.map(column => (
              <MenuItem key={column.id} name={column.Header}>
                <Checkbox {...column.getToggleHiddenProps()} />
                <ListItemText primary={column.Header} />
              </MenuItem>
            ))
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
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

export default CategoryItemTable