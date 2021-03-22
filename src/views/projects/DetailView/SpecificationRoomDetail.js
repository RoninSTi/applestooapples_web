import React, { useState } from 'react'

import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from '../../../store'
import {
  createProjectSpecificationItem,
  editProjectSpecificationItem
} from '../../../slices/projects'

import { useSnackbar } from 'notistack'

import {
  Box,
  Button,
  Link,
  makeStyles,
  SvgIcon,
  Typography,
} from '@material-ui/core';
import NavigatePreviousIcon from '@material-ui/icons/NavigateBefore';

import { Link as RouterLink } from 'react-router-dom'

import AddSpecificationItemModal from './AddSpecificationItemModal'
import CategoryCard from './CategoryCard'

import { ROOM_SPECIFICATIONS } from 'src/utils/enums'

const useStyles = makeStyles((theme) => ({
  back: {
    display: 'flex',
    alignItems: 'center'
  }
}));

const SpecificationRoomDetail = () => {
  const classes = useStyles()

  const projectDetail = useSelector(state => state.projects.projectDetail)
  
  const { projectId, specificationId } = useParams()

  const specification = projectDetail.specifications.find(specification => `${specification.id}` === specificationId);

  const { categories, room } = specification

  const [editSpecificationItem, setEditSpecificationItem] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

  const handleOnClickAdd = () => {
    setIsOpen(true)
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

    const handleOnSubmitAddItem = async specificationItem => {
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

  const handleAddItemModalOnCancel = () => {
    setEditSpecificationItem(null)

    setIsOpen(false);
  }

  const handleOnEdit = ({ item }) => {
    setEditSpecificationItem(item)

    setIsOpen(true)
  }

  return (
    <div>
      <Box>
        <Link
          className={classes.back}
          color="primary"
          component={RouterLink}
          to={`/app/management/projects/${projectId}`}
        >
          <SvgIcon>
            <NavigatePreviousIcon />
          </SvgIcon>
          <Typography display="inline" variant="body2">
            Back to rooms
          </Typography>
        </Link>
      </Box>
      <Box display="flex" justifyContent="space-between" marginTop={2}>
        <Typography variant="h3">
          {ROOM_SPECIFICATIONS.find(({ value }) => value === room).label}
        </Typography>
        <Button
          color="primary"
          onClick={handleOnClickAdd}
          variant="contained">
          Add Item
        </Button>
      </Box>
      <Box marginTop={2}>
        {categories.map(category => <CategoryCard key={`category-${category.id}`} category={category} onEdit={handleOnEdit} />)}
      </Box>
      <AddSpecificationItemModal
        isOpen={isOpen}
        editSpecificationItem={editSpecificationItem}
        onCancel={handleAddItemModalOnCancel}
        onSubmit={handleOnSubmitAddItem}
        onSubmitEdit={handleOnSubmitEditItem}
      />
    </div>
  )
}

export default SpecificationRoomDetail