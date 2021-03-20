import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const Header = ({ name }) => {
  return (
    <Box mt={6} mb={6}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link color="inherit" to="/app" component={RouterLink}>
            Dashboard
          </Link>
          <Typography color="textPrimary">
            <Link
              variant="body1"
              color="inherit"
              to="/app/management/projects"
              component={RouterLink}>
              Projects
            </Link>
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
            {name || 'Project Details'}
        </Typography>
    </Box>
  );
}

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
