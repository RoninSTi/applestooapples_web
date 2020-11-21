import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

const AccountGuard = ({ children }) => {
  const { user } = useAuth();

  const account = user.account

  if (account) {
    return <Redirect to="/app/account" />;
  }

  return (
    <>
      {children}
    </>
  );
};

AccountGuard.propTypes = {
  children: PropTypes.node
};

export default AccountGuard;
