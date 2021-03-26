import React, { useState } from 'react' 

import { useDispatch } from 'src/store'
import { copyCategory, deleteCategory } from 'src/slices/projects'

import { useSnackbar } from 'notistack'

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  makeStyles,
  Paper,
  Popper,
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
  Check as CheckIcon,
  Copy as CopyIcon,
  Trash as TrashIcon,
  X as XIcon,
} from 'react-feather';

import PerfectScrollbar from 'react-perfect-scrollbar';

import { CATEGORIES } from 'src/utils/enums';

import CategoryItem from './CategoryItem';
import CopyCategoryModal from './CopyCategoryModal';

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: '2em'
  },
  popper: {
    padding: theme.spacing(5, 3),
  },
}))

const CategoryCard = ({ category, onEdit }) => {
  const { items, total, type } = category

  const classes = useStyles()

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [anchorEl, setAnchorEl] = useState(null)
  const [isOpen, setIsOpen] = useState(false);

  const handleOnClickCopy = () => {
    setIsOpen(true);
  }

  const handleOnClickCopyCancel = () => {
    setIsOpen(false);
  }

  const handleOnClickCopySubmit = async data => {
    try {
      await dispatch(copyCategory({
        categoryId: category.id,
        data,
      }));

      enqueueSnackbar('Category copied', {
        variant: 'success'
      });
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error'
      });
    }
  }

  const handleOnClickCategoryDelete = async data => {
    try {
      await dispatch(deleteCategory({
        categoryId: category.id,
      }));

      enqueueSnackbar('Category deleted', {
        variant: 'success'
      });
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error'
      });
    }
  }

  const handleOnClickCancelDelete = () => {
    setAnchorEl(null)
  }

  const handleOnClickDelete = e => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
   }
  
  const handleOnClickEdit = ({ item }) => { 
    onEdit({ item })
  }

  const popperIsOpen = Boolean(anchorEl)

  return (
    <>
    <Card className={classes.card}>
      <CardHeader
        action={
          <>
            <IconButton onClick={handleOnClickDelete}>
              <SvgIcon color="primary" fontSize="small">
                <TrashIcon/>
              </SvgIcon>
            </IconButton>
            <IconButton onClick={handleOnClickCopy}>
              <SvgIcon color="primary" fontSize="small">
                <CopyIcon />
              </SvgIcon>
            </IconButton>
          </>
        }
        title={CATEGORIES.find(({ value }) => value === type).label }/>
      <Divider />
      <CardContent>
        {items.length > 0 &&
          <PerfectScrollbar>
            <TableContainer>
              <Table
                size="small"
                aria-label="purchases"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>QTY</TableCell>
                    <TableCell>U/M</TableCell>
                    <TableCell>Manufacturer</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Material</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Dimensions</TableCell>
                    <TableCell>Comments</TableCell>
                    <TableCell>Finish</TableCell>
                    <TableCell>Provided By</TableCell>
                    <TableCell>Phase</TableCell>
                    <TableCell>Cost</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map(item => <CategoryItem key={`catItem-${item.id}`} category={type} onEdit={handleOnClickEdit} item={item} />)}
                </TableBody>
              </Table>
            </TableContainer>
          </PerfectScrollbar>}
        {items.length === 0 &&
          <Box>
            <Typography>No items in this category.</Typography>
          </Box>
        }
        </CardContent>
        <CardActions>
          <Box display='flex' flex={1} justifyContent='flex-end' p={1}>
            <Typography>{`Total: $${parseFloat(total).toFixed(2)}`}</Typography>
          </Box>
        </CardActions>
      </Card>

      <Popper open={popperIsOpen} anchorEl={anchorEl}>
          <Paper className={classes.popper} elevation={1}>
            <Typography>Delete selected specification?</Typography>
            <div style={{ float: 'right' }}>
              <IconButton onClick={handleOnClickCancelDelete}>
                <SvgIcon style={{ color: 'red ' }} fontSize="small">
                  <XIcon />
                </SvgIcon>
              </IconButton>
              <IconButton onClick={handleOnClickCategoryDelete}>
                <SvgIcon style={{ color: 'green' }} fontSize="small">
                  <CheckIcon />
                </SvgIcon>
              </IconButton>
            </div>
          </Paper>
      </Popper>  

      <CopyCategoryModal onCancel={handleOnClickCopyCancel} onSubmit={handleOnClickCopySubmit} isOpen={isOpen} />
      </>
  )
}

export default CategoryCard