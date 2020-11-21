import React from 'react'
import { Typography } from '@material-ui/core';
import _ from 'lodash'
import PropTypes from 'prop-types';

const AccountType = ({ user }) => {
  const { account: { type } } = user 

  return (
    <Typography
      color="textPrimary"
      variant="body1"
    >
      {_.capitalize(type)}
    </Typography>
  )
}

AccountType.propTypes = {
  user: PropTypes.object.isRequired
};

export default AccountType