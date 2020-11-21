import React from 'react';
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Link as RouterLink } from 'react-router-dom';
import Page from 'src/components/Page';
// import Header from './Header';
// import Statistics from './Statistics';
// import Notifications from './Notifications';
// import Projects from './Projects';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const ListView = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Projects"
    >
      <Container maxWidth="lg">
        <Box mt={6}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link
              variant="body1"
              color="inherit"
              to="/app"
              component={RouterLink}
            >
              Dashboard
            </Link>
            <Typography
              variant="body1"
              color="textPrimary"
            >
              Projects
            </Typography>
          </Breadcrumbs>
          <Typography
            variant="h3"
            color="textPrimary"
          >
            Existing projects
          </Typography>
        </Box>
      </Container>
    </Page>
  );
};

export default ListView;
