import React from 'react';

import { Route, Switch } from 'react-router-dom'

import {
  Box,
  Container,
  makeStyles,
} from '@material-ui/core';

import SpecificationRooms from './SpecificationRooms'
import SpecificationRoomDetail from './SpecificationRoomDetail'
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  popper: {
    padding: theme.spacing(5, 3),
  },
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const Specifications = ({ project }) => {
  const classes = useStyles();

  const { specifications } = project 

  return (
    <Page
      className={classes.root}
      title="Specifications"
    >
      <Container maxWidth="lg">
        <Box mb={4}>
          <Switch>
            <Route
              exact
              path='/app/management/projects/:projectId'>
              <SpecificationRooms projectId={project.id} specifications={specifications} />
            </Route>
            <Route
              exact
              path='/app/management/projects/:projectId/specification/:specificationId'>
              <SpecificationRoomDetail />
            </Route>
          </Switch>
        </Box>
      </Container>
    </Page>
  );
};

export default Specifications
