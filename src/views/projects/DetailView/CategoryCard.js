import React, { useEffect, useMemo, useState } from 'react' 

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
  TableContainer,
  Typography
} from '@material-ui/core';

import {
  Check as CheckIcon,
  Columns as ColumnsIcon,
  Copy as CopyIcon,
  Trash as TrashIcon,
  X as XIcon,
} from 'react-feather';

import PerfectScrollbar from 'react-perfect-scrollbar';

import { CATEGORIES } from 'src/utils/enums';

import CategoryItemTable from './CategoryItemTable';
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
  const columns = useMemo(
    () => [
      {
        Header: 'Item',
        accessor: 'item'
      },
      {
        Header: 'QTY',
        accessor: 'qty',
      },
      {
        Header: 'U/M',
        accessor: 'um'
      },
      {
        Header: 'Manufacturer',
        accessor: 'manufacturer'
      },
      {
        Header: 'Model',
        accessor: 'model'
      },
      {
        Header: 'Material',
        accessor: 'material'
      },
      {
        Header: 'Description',
        accessor: 'description'
      },
      {
        Header: 'Dimensions',
        accessor: 'dimensions'
      },
      {
        Header: 'Comments',
        accessor: 'comments'
      },
      {
        Header: 'Finish',
        accessor: 'finish'
      },
      {
        Header: 'Provided By',
        accessor: 'provided'
      },
      {
        Header: 'Phase',
        accessor: 'phase'
      },
      {
        Header: 'Cost',
        accessor: 'cost'
      },
      {
        Header: 'Total',
        accessor: 'total'
      },
      {
        Header: 'Actions',
        accessor: 'actions'
      }
    ],
    []
  )

  const [initialCols, setInitialCols] = useState(null)

  useEffect(() => {
    const visibleColumnIdsRaw = window.localStorage.getItem(`${category.type.toUpperCase()}-COLS`)

    const visibleColumnIds = JSON.parse(visibleColumnIdsRaw)

    const hiddenColumnIds = columns
      .map(({ accessor }) => {
        return visibleColumnIds.indexOf(accessor) === -1 ? accessor : undefined
      })
      .filter(elem => elem !== undefined)
    
    setInitialCols(hiddenColumnIds)
  }, [category.type, columns])

  const { items, total, type } = category

  const classes = useStyles()

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [anchorEl, setAnchorEl] = useState(null)
  const [isOpen, setIsOpen] = useState(false);
  const [colDialogIsOpen, setColDialogIsOpen] = useState(false);

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

  const handleOnClickColumns = () => {
    setColDialogIsOpen(true)
  }

  const handleOnCloseColDialog = () => {
    setColDialogIsOpen(false)
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
            <IconButton onClick={handleOnClickColumns}>
              <SvgIcon color="primary" fontSize="small">
                <ColumnsIcon />
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
              {initialCols &&
                <CategoryItemTable
                  category={category.type}
                  columns={columns}
                  data={items}
                  initialCols={initialCols}
                  isOpen={colDialogIsOpen}
                  onEdit={handleOnClickEdit}
                  onClose={handleOnCloseColDialog}
                />}
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