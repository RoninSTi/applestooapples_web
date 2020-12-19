import React, { useState } from 'react';

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  makeStyles,
} from '@material-ui/core';

import DraftEditor from 'src/components/DraftEditor'
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const Scope = ({ isSubmitting, onUpdate, project }) => {
  const classes = useStyles();

  const [scope, setScope] = useState(null)

  if (!project) return null;

  const handleOnContentStateChange = contentState => {
    setScope(JSON.stringify(contentState))
  }

  const handleOnClickUpdate = () => {
    onUpdate({
      data: {
        scope,
      },
      successMessage: 'Scope updated'
    })
  }

  return (
    <Page
      className={classes.root}
      title="Project scope"
    >
      <Container maxWidth="lg">
        <Card>
          <CardContent>
            <Grid container spacing={4}>
              <Grid item sm={12} md={12}>
                <DraftEditor initialContentState={project?.scope ? JSON.parse(project.scope) : null} onContentStateChange={handleOnContentStateChange} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box
          display="flex"
          justifyContent="flex-end"
          mt={2}
        >
          <Button
            color="secondary"
            onClick={handleOnClickUpdate}
            variant="contained"
          >
            {isSubmitting ? <CircularProgress color='inherit' size={20} /> : 'Update'}
          </Button>
        </Box>
      </Container>
    </Page>
  );
};

export default Scope
