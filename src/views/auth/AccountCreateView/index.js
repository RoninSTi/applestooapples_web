import React, { useState } from 'react';
import clsx from 'clsx';
import api from 'src/utils/api'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  makeStyles
} from '@material-ui/core';
import BusinessIcon from '@material-ui/icons/Business'
import CreateIcon from '@material-ui/icons/Create';
import DashboardIcon from '@material-ui/icons/Dashboard'
import HomeIcon from '@material-ui/icons/Home'
import Page from 'src/components/Page';
import useAuth from 'src/hooks/useAuth';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    height: '100%',
    paddingTop: 120,
    paddingBottom: 120
  },
  product: {
    position: 'relative',
    padding: theme.spacing(5, 3),
    cursor: 'pointer',
    transition: theme.transitions.create('transform', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    '&:hover': {
      transform: 'scale(1.1)'
    }
  },
  productImage: {
    backgroundColor: theme.palette.background.default,
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    position: 'absolute',
    top: -24,
    left: theme.spacing(3),
    height: 48,
    width: 48,
    fontSize: 24
  },
  recommendedProduct: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white
  },
  chooseButton: {
    backgroundColor: theme.palette.common.white
  }
}));

const AccountCreateView = () => {
  const classes = useStyles();

  const { updateSession } = useAuth();

  const [isLoading, setIsLoading] = useState(false)

  const handleOnClick = async type => {
    setIsLoading(true)

    try {
      const response = await api({
        method: 'post',
        url: 'account',
        data: {
          type
        }
      })

      const { accessToken } = response.data

      updateSession(accessToken)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Page
      className={classes.root}
      title="Pricing"
    >
      <Container maxWidth="sm">
        <Typography
          align="center"
          variant="h1"
          color="textPrimary"
        >
          Welcome to Apples Too Apples!
        </Typography>
        <Box mt={3}>
          <Typography
            align="center"
            variant="subtitle1"
            color="textSecondary"
          >
            In order to best serve your needs, we'd love to know a little bit about your.  Please select one of the options below that best describes you!
          </Typography>
        </Box>
      </Container>
      <Box mt="160px">
        <Container maxWidth="lg">
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={3}
              xs={12}
            >
              <Paper
                className={classes.product}
                elevation={1}
              >
                <DashboardIcon className={classes.productImage} />
                <Typography
                  component="h3"
                  gutterBottom
                  variant="overline"
                  color="textSecondary"
                >
                  Architect
                </Typography>
                <Box my={2}>
                  <Divider />
                </Box>
                <Typography
                  variant="body2"
                  color="textPrimary"
                >
                  Some information describing the architect user
                </Typography>
                <Box my={2} />
                <Button
                  onClick={() => handleOnClick('architect')}
                  variant="contained"
                  fullWidth
                  className={classes.chooseButton}
                >
                  {isLoading ? <CircularProgress /> : 'Choose'}
                </Button>
              </Paper>
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
            >
              <Paper
                className={clsx(classes.product)}
                elevation={1}
              >
                <BusinessIcon className={classes.productImage} />
                <Typography
                  component="h3"
                  gutterBottom
                  variant="overline"
                  color="textSecondary"
                >
                  Contractor
                </Typography>
                <Box my={2}>
                  <Divider />
                </Box>
                <Typography
                  variant="body2"
                  color="inherit"
                >
                  Some information describing the contractor user
                </Typography>
                <Box my={2} />
                <Button
                  onClick={() => handleOnClick('contractor')}
                  variant="contained"
                  fullWidth
                  className={classes.chooseButton}
                >
                  Choose
                </Button>
              </Paper>
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
            >
              <Paper
                className={classes.product}
                elevation={1}
              >
                <CreateIcon className={classes.productImage} />
                <Typography
                  component="h3"
                  gutterBottom
                  variant="overline"
                  color="textSecondary"
                >
                  Designer
                </Typography>
                <Box my={2}>
                  <Divider />
                </Box>
                <Typography
                  variant="body2"
                  color="textPrimary"
                >
                  Some information describing the designer user
                </Typography>
                <Box my={2} />
                <Button
                  onClick={() => handleOnClick('designer')}
                  variant="contained"
                  fullWidth
                  className={classes.chooseButton}
                >
                  Choose
                </Button>
              </Paper>
            </Grid>
            <Grid
              item
              md={3}
              xs={12}
            >
              <Paper
                className={classes.product}
                elevation={1}
              >
                <HomeIcon className={classes.productImage} />
                <Typography
                  component="h3"
                  gutterBottom
                  variant="overline"
                  color="textSecondary"
                >
                  Homeowner
                </Typography>
                <Box my={2}>
                  <Divider />
                </Box>
                <Typography
                  variant="body2"
                  color="textPrimary"
                >
                  Some information describing the homeowner user
                </Typography>
                <Box my={2} />
                <Button
                  onClick={() => handleOnClick('homeowner')}
                  variant="contained"
                  fullWidth
                  className={classes.chooseButton}
                >
                  Choose
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Page>
  );
};

export default AccountCreateView;
