import React from "react";
import PropTypes from "prop-types";

import { Grid, makeStyles, TextField } from "@material-ui/core";

import {
  CATEGORIES,
  CURRENCY,
  PHASES,
  PROVIDED
} from 'src/utils/enums'


const useStyles = makeStyles(() => ({
  root: {},
  numberField: { appearance: 'none' }
}));

const items = {
  accessories: [
    'Towel Bar',
    'Towel Ring',
    'Paper Holder',
    'Spare Paper Holder',
    'Hook',
    'Warming Towel Bar',
    'Shelf',
    'Soap Dish',
    'Toothbrush Holder',
    'Tumbler',
    'Hotel rack',
    'Mirror',
    'Magnifying mirror',
  ],
  appliances: [
    'Refrigerator',
    'Outdoor refrigerator',
    'Under counter refrigerator',
    'Range',
    'Cooktop',
    'Oven',
    'Oven 2',
    'Steam Oven',
    'Pizza Oven',
    'Warming Drawer',
    'Microwave',
    'Freezer',
    'Dishwasher 1',
    'Dishwasher 2',
    'Hood Vent',
    'Beverage cooler',
    'Beverage Drawer',
    'Ice Maker',
    'Water Dispenser',
    'Built-in Coffee Maker',
    'Disposal',
    'Washer',
    'Dryer'
  ],
  furnishings: [
    'Tables',
    'Kitchen Table',
    'Dining Room Table',
    'Outdoor Dining Table',
    'Coffee Table',
    'End Table',
    'Side Table',
    'Console',
    'Nightstand',
    'Changing Table',
    'Game Table',
    'Billiards Table',
    'Ping Pong Table',
    'Seating',
    'Kitchen Chair',
    'Dining Room Chair',
    'Bar stools',
    'Side Chair',
    'Rocking Chair',
    'Arm Chair',
    'Desk Chair',
    'Bench',
    'Sofa',
    'Sleeper Sofa',
    'Loveseat',
    'Sette',
    'Ottoman',
    'Home Theater Seats',
    'Outdoor sofa',
    'Outdoor chairs',
    'Beds',
    'Headboard',
    'Four - poster bed',
    'Murphy bed',
    'Platform bed',
    'Sleigh bed',
    'Canopy bed',
    'Bunk',
    'Crib',
    'Mattress - King',
    'Mattress - Queen',
    'Mattress - Full ',
    'Mattress - Twin',
    'Mattress - Bunk',
    'Mattress - Crib',
    'Desk',
    'Bookshelf / bookcase',
    'Filing Cabinet',
    'Dresser',
    'Sideboard',
    'Hutch',
    'Etagere',
    'Bar Cabinet',
    'Entertainment Cabinet',
    'Piano',
  ],
  hardware: [
    'Handle set - Passage',
    'Handle set - Privacy',
    'Handle set - Dummy',
    'Handle set - Door stop',
    'Window Hardware'
  ],
  lighting: [
    'Fan / Light',
    'Accent Light',
    'Surface Fixture',
    'Recessed Fixture',
    'Cove Lighting',
    'Under cabinet lighting',
    'Ceiling Fan',
    'Chandelier',
    'Accent Sconces',
    'Beam Spot Light',
    'Hanging Pendant',
  ],
  plumbing: [
    'Sink',
    'Faucet',
    'Drain',
    'P-trap',
    'Toilet',
    'Toilet seat',
    'Toilet Lever',
    'Bidet',
    'Tub',
    'Tub Filler',
    'Tub Drain',
    'Shower head',
    'Shower arm',
    'Shower system',
    'Shower trim',
    'Hand shower',
    'Shower Drain',
    'Shower Drain Cover',
    'Body sprays',
    'Supply Kit',
    'Steam Unit',
    'Volume control trim',
    'Volume control rough',
    'Diverter Trim',
    'Diverter Rough',
    'Basket strainer grid'
  ],
  stone: [
    'Floor Tile',
    'Base Tile',
    'Trim Tile',
    'Field Tile',
    'Chair Rail',
    'Upper Field Tile',
    'Backsplash',
    'Crown Molding',
    'Shower floor',
    'Shower walls',
    'Vanity Countertop material',
    'Shower Curb',
    'Bench seat',
    'Niche shelves',
    'Countertop material',
    'Backsplash'
  ]
}

const SpecificationItemForm = ({
  errors,
  handleBlur,
  handleChange,
  touched,
  values
}) => {

  const qty = isNaN(parseInt(values.qty)) ? 0 : parseInt(values.qty)

  const cost = isNaN(parseInt(values.cost)) ? 0 : parseInt(values.cost)

  const total = cost * qty

  const classes = useStyles()

  return (
    <>
      <Grid item md={12} xs={12}>
        <TextField
          error={Boolean(touched.category && errors.category)}
          fullWidth
          helperText={touched.category && errors.category}
          label="Category"
          name="category"
          onBlur={handleBlur}
          onChange={handleChange}
          select
          SelectProps={{ native: true }}
          value={values.category}
          variant="outlined"
        >
          {CATEGORIES.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item md={12} xs={12}>
        <TextField
          className={classes.numberField}
          error={Boolean(touched.item && errors.item)}
          fullWidth
          helperText={touched.item && errors.item}
          label="Item"
          name="item"
          onBlur={handleBlur}
          onChange={handleChange}
          select
          SelectProps={{ native: true }}
          value={values.item}
          variant="outlined"
        >
          <option value=''>Select item</option>
          {items[values.category]?.map((item, index) => (
            <option key={`item-${index}`} value={item}>
              {item}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item md={4} xs={4}>
        <TextField
          className={classes.numberField}
          error={Boolean(touched.cost && errors.cost)}
          fullWidth
          helperText={touched.cost && errors.cost}
          label="Cost"
          name="cost"
          onBlur={handleBlur}
          onChange={handleChange}
          type="number"
          value={values.cost}
          variant="outlined"
        />
      </Grid>
      <Grid item md={4} xs={4}>
        <TextField
          className={classes.numberField}
          error={Boolean(touched.qty && errors.qty)}
          fullWidth
          helperText={touched.qty && errors.qty}
          label="QTY"
          name="qty"
          onBlur={handleBlur}
          onChange={handleChange}
          type="number"
          value={values.qty}
          variant="outlined"
        />
      </Grid>
      <Grid item md={4} xs={4}>
        <TextField
          error={Boolean(touched.currency && errors.currency)}
          fullWidth
          helperText={touched.currency && errors.currency}
          label="Currency"
          name="currency"
          onBlur={handleBlur}
          onChange={handleChange}
          select
          SelectProps={{ native: true }}
          value={values.currency}
          variant="outlined"
        >
          {CURRENCY.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item md={12} xs={12}>
        <TextField
          error={Boolean(touched.total && errors.total)}
          fullWidth
          helperText={touched.total && errors.total}
          label="Total"
          name="total"
          inputProps={{
            readOnly: true,
          }}
          onBlur={handleBlur}
          onChange={handleChange}
          type="number"
          value={total}
          variant="outlined"
        />
      </Grid>
      <Grid item md={4} xs={4}>
        <TextField
          error={Boolean(touched.manufacturer && errors.manufacturer)}
          fullWidth
          helperText={touched.manufacturer && errors.manufacturer}
          label="Manufacturer"
          name="manufacturer"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.manufacturer}
          variant="outlined"
        />
      </Grid>
      <Grid item md={4} xs={4}>
        <TextField
          error={Boolean(touched.model && errors.model)}
          fullWidth
          helperText={touched.model && errors.model}
          label="Model"
          name="model"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.model}
          variant="outlined"
        />
      </Grid>
      <Grid item md={4} xs={4}>
        <TextField
          error={Boolean(touched.um && errors.um)}
          fullWidth
          helperText={touched.um && errors.um}
          label="U/M"
          name="um"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.um}
          variant="outlined"
        />
      </Grid>
      <Grid item md={12} xs={12}>
        <TextField
          error={Boolean(touched.description && errors.description)}
          fullWidth
          helperText={touched.description && errors.description}
          label="Description"
          name="description"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.description}
          variant="outlined"
        />
      </Grid>
      <Grid item md={6} xs={6}>
        <TextField
          error={Boolean(touched.dimensions && errors.dimensions)}
          fullWidth
          helperText={touched.dimensions && errors.dimensions}
          label="Dimensions"
          name="dimensions"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.dimensions}
          variant="outlined"
        />
      </Grid>
      <Grid item md={6} xs={6}>
        <TextField
          error={Boolean(touched.finish && errors.finish)}
          fullWidth
          helperText={touched.finish && errors.finish}
          label="Finish"
          name="finish"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.finish}
          variant="outlined"
        />
      </Grid>
      <Grid item md={12} xs={12}>
        <TextField
          error={Boolean(touched.comments && errors.comments)}
          fullWidth
          helperText={touched.comments && errors.comments}
          label="Comments"
          name="comments"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.comments}
          variant="outlined"
        />
      </Grid>
      <Grid item md={6} xs={6}>
        <TextField
          error={Boolean(touched.provided && errors.provided)}
          fullWidth
          helperText={touched.provided && errors.provided}
          label="Provided"
          name="provided"
          onBlur={handleBlur}
          onChange={handleChange}
          select
          SelectProps={{ native: true }}
          value={values.provided}
          variant="outlined"
        >
          {PROVIDED.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item md={6} xs={6}>
        <TextField
          error={Boolean(touched.phase && errors.phase)}
          fullWidth
          helperText={touched.phase && errors.phase}
          label="Phase"
          name="phase"
          onBlur={handleBlur}
          onChange={handleChange}
          select
          SelectProps={{ native: true }}
          value={values.phase}
          variant="outlined"
        >
          {PHASES.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </TextField>
      </Grid>
    </>
  );
};

SpecificationItemForm.defaultProps = {
  errors: {},
  handleBlur: () => {},
  handleChange: () => {},
  touched: {},
  setFieldValue: () => {},
  values: {}
};

SpecificationItemForm.propTypes = {
  errors: PropTypes.object,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  touched: PropTypes.object,
  setFieldValue: PropTypes.func,
  values: PropTypes.object
};

export default SpecificationItemForm;
