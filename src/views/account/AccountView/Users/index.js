import React from 'react';
import clsx from 'clsx';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles
} from '@material-ui/core';
import { useSelector } from 'src/store'
import Invite from './Invite'
import Results from './Results';

const useStyles = makeStyles((theme) => ({
  root: {}
}));

const UserListView = () => {
  const classes = useStyles();

  const accountUsers = useSelector(state => state.account.activeAccount?.users)

  return (
    <Card
      className={clsx(classes.root)}
    >
      <CardHeader title="All Account Users" />
      <Divider />
      <CardContent>
        <Invite />
        <Box mt={2} />
          <Results users={accountUsers} />
      </CardContent>
    </Card>
  );
};

export default UserListView;
