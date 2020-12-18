import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Divider,
  Tab,
  Tabs,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';

import { useParams } from 'react-router-dom'

import { useDispatch, useSelector } from 'src/store'
import { clearDetail, getProject } from 'src/slices/projects';

import Addresses from './Addresses';
import Collaborators from './Collaborators';
import Header from './Header'
import ProjectDescription from './ProjectDescription'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const ListView = () => {
  const classes = useStyles();

  const { projectId } = useParams()

  const dispatch = useDispatch()

  useEffect(() => {
    if (projectId) {
      dispatch(getProject({ projectId }))
    }

    return () => {
      dispatch(clearDetail())
    }
  }, [dispatch, projectId])

  const project = useSelector(state => state.projects.projectDetail)

  const [currentTab, setCurrentTab] = useState('description');

  const tabs = [
    { value: 'description', label: 'Description' },
    { value: 'collaborators', label: 'Collaborators' },
    { value: 'addresses', label: 'Addresses'}
  ];

  const handleTabsChange = (_, value) => {
    setCurrentTab(value);
  };

  return (
    <Page
      className={classes.root}
      title="Project Details"
    >
      <Container maxWidth="lg">
        <Header />
        <Box mt={3}>
          <Tabs
            onChange={handleTabsChange}
            scrollButtons="auto"
            value={currentTab}
            variant="scrollable"
            textColor="secondary"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
              />
            ))}
          </Tabs>
        </Box>
        <Divider />
        <Box mt={3}>
          {currentTab === 'addresses' && <Addresses project={project} />}
          {currentTab === 'collaborators' && <Collaborators project={project} />}
          {currentTab === 'description' && <ProjectDescription project={project} />}
        </Box>
      </Container>
    </Page>
  );
};

export default ListView;
