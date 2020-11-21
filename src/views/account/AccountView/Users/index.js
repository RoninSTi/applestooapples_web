import React, { useState } from 'react';
import clsx from 'clsx';
import {
  Box,
  Button,
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

  const [inviteIsOpen, setInviteIsOpen] = useState(false)

  const accountUsers = useSelector(state => state.account.account?.users)

  const handleOnCancel = () => {
    setInviteIsOpen(false)
  }

  const handleOnClickInviteUser = () => {
    setInviteIsOpen(!inviteIsOpen)
  }

  return (
    <Card
      className={clsx(classes.root)}
    >
      <CardHeader action={
        <Button
          color="secondary"
          onClick={handleOnClickInviteUser}
          variant='contained'
        >
          Invite User
          </Button>
      }title="All Account Users" />
      <Divider />
      <CardContent>
        <Invite isOpen={inviteIsOpen} onCancel={handleOnCancel} />
        <Box mt={2} />
          <Results users={accountUsers} />
      </CardContent>
    </Card>
  );
};

export default UserListView;
