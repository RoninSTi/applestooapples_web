import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

const AccountGuard = ({ children }) => {
  const { user } = useAuth();

  const accounts = user?.accounts

  if (accounts?.length > 0) {
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
