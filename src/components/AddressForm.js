import React from 'react';
import PropTypes from 'prop-types'

import {
  Box,
  CardContent,
  FormHelperText,
  Grid,
  TextField,
} from '@material-ui/core';

import countries from 'src/views/account/AccountView/General/countries'

const STATES = [
  'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA',
  'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA',
  'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND',
  'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT',
  'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const AddressForm = ({ errors, handleBlur, handleChange, values, touched }) => {
  return (
    <>
        <Grid
          item
          md={12}
          xs={12}
        >
          <TextField
            error={Boolean(touched.name && errors.name)}
            fullWidth
            helperText={touched.name && errors.name}
            label="Name"
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.name}
            variant="outlined"
          />
        </Grid>
        <Grid
          item
          md={12}
          xs={12}
        >
          <TextField
            error={Boolean(touched.companyName && errors.companyName)}
            fullWidth
            helperText={touched.companyName && errors.companyName}
            label="Company Name"
            name="companyName"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.companyName}
            variant="outlined"
          />
        </Grid>
        <Grid
          item
          md={12}
          xs={12}
        >
          <TextField
            error={Boolean(touched.address && errors.address)}
            fullWidth
            helperText={touched.address && errors.address}
            label="Address"
            name="address"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.address}
            variant="outlined"
          />
        </Grid>
        <Grid
          item
          md={12}
          xs={12}
        >
          <TextField
            error={Boolean(touched.address2 && errors.address2)}
            fullWidth
            helperText={touched.address2 && errors.address2}
            label="Address Line 2"
            name="address2"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.address2}
            variant="outlined"
          />
        </Grid>
        <Grid
          item
          md={12}
          xs={12}
        >
          <TextField
            error={Boolean(touched.city && errors.city)}
            fullWidth
            helperText={touched.city && errors.city}
            label="City"
            name="city"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.city}
            variant="outlined"
          />
        </Grid>
        <Grid
          item
          md={2}
          xs={2}
        >
          <TextField
            error={Boolean(touched.state && errors.state)}
            fullWidth
            helperText={touched.state && errors.state}
            label="State"
            name="state"
            onBlur={handleBlur}
            onChange={handleChange}
            select
            SelectProps={{ native: true }}
            value={values.state}
            variant="outlined"
          >
            {STATES.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          md={4}
          xs={4}
        >
          <TextField
            error={Boolean(touched.postalCode && errors.postalCode)}
            fullWidth
            helperText={touched.postalCode && errors.postalCode}
            label="Zip Code"
            name="postalCode"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.postalCode}
            variant="outlined"
          />
        </Grid>
        <Grid
          item
          md={6}
          xs={6}
        >
          <TextField
            error={Boolean(touched.country && errors.country)}
            fullWidth
            helperText={touched.country && errors.country}
            label="Country"
            name="country"
            onBlur={handleBlur}
            onChange={handleChange}
            select
            SelectProps={{ native: true }}
            value={values.country}
            variant="outlined"
          >
            {countries.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.text}
              </option>
            ))}
          </TextField>
      </Grid>
    </>
  )
}

AddressForm.defaultProps = {
  errors: {},
  handleBlur: () => { },
  handleChange: () => { },
  touched: {},
  values: {}
}

AddressForm.propTypes = {
  errors: PropTypes.object,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  touched: PropTypes.object,
  values: PropTypes.object
}

export default AddressForm;