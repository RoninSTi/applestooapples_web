import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Divider,
  Tab,
  Tabs
} from '@material-ui/core';
import Page from 'src/components/Page'

import { Redirect, useParams } from 'react-router-dom'

import { useDispatch, useSelector } from 'src/store'
import { clearDetail, getProject, updateProject } from 'src/slices/projects'

import { useSnackbar } from 'notistack'

import Addresses from './Addresses'
import Collaborators from './Collaborators'
import Documents from './Documents'
import Header from './Header'
import ProjectDescription from './ProjectDescription'
import Scope from './Scope'
import Specifications from './Specifications'

const ListView = () => {
  const { projectId } = useParams()

  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

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

  const [isSubmitting, setIsSubmitting] = useState(false)

  const tabs = [
    { value: 'description', label: 'Description' },
    { value: 'collaborators', label: 'Collaborators' },
    { value: 'addresses', label: 'Addresses' },
    { value: 'scope', label: 'Scope' },
    { value: 'documents', label: 'Documents'},
    { value: 'specifications', label: 'Specifications'},
  ];

  const handleTabsChange = (_, value) => {
    setCurrentTab(value);
  };

  const handleOnUpdate = async ({ data, successMessage }) => {
    setIsSubmitting(true)
    try {
      await dispatch(updateProject({
        data,
        projectId: project.id
      }));

      enqueueSnackbar(successMessage, {
        variant: 'success'
      });
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error'
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Page>
      <Container maxWidth="lg">
        <Header name={project?.name} />
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
          {currentTab === 'scope' && <Scope isSubmitting={isSubmitting} project={project} onUpdate={handleOnUpdate} />}
          {currentTab === 'documents' && <Documents project={project} />}
          {currentTab === 'specifications' &&
            <>
              <Redirect to={`/app/management/projects/${project.id}`} />
              <Specifications project={project} />
            </>
          }
        </Box>
      </Container>
    </Page>
  );
};

export default ListView;
