import React from 'react' 

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Collapse,
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
  Edit2 as PencilIcon,
  Trash as TrashIcon,
  X as XIcon,
} from 'react-feather';

import PerfectScrollbar from 'react-perfect-scrollbar';

import { CATEGORIES } from 'src/utils/enums'

import CategoryItem from './CategoryItem'

const CategoryCard = ({ category, onEdit }) => {
  const { items, type } = category

  const handleOnClickDelete = () => { }
  
  const handleOnClickEdit = ({ item }) => { 
    console.log({ item })
    onEdit({ item })
  }

  return (
    <Card>
      <CardHeader
        action={<Button color="secondary">Copy</Button>}
        title={CATEGORIES.find(({ value }) => value === type).label }/>
      <Divider />
      <CardContent>
        <PerfectScrollbar>
          <TableContainer>
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
                {items.map(item => <CategoryItem key={`catItem-${item.id}`} category={type} onEdit={handleOnClickEdit} item={item} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </PerfectScrollbar>
      </CardContent>
    </Card>
  )
}

export default CategoryCard