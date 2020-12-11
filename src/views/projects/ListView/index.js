import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { Link as RouterLink } from 'react-router-dom';
import Page from 'src/components/Page';
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Popper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  makeStyles,
  CircularProgress
} from '@material-ui/core';

import { useDispatch, useSelector } from 'src/store'
import { copyProject, deleteProject, getProjects } from 'src/slices/projects'
import {
  Check as CheckIcon,
  Trash as TrashIcon,
  Search as SearchIcon,
  X as XIcon,
  Zap as ZapIcon
} from 'react-feather';

import { PROJECT_TYPES } from 'src/utils/enums'

const sortOptions = [
  {
    value: 'updatedAt|desc',
    label: 'Last update (newest first)'
  },
  {
    value: 'updatedAt|asc',
    label: 'Last update (oldest first)'
  },
];

const applyFilters = (projects, query) => {
  return projects.filter((project) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      // const properties = ['email', 'name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (project[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });
};

const applyPagination = (projects, page, limit) => {
  return projects.slice(page * limit, page * limit + limit);
};

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const applySort = (projects, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = projects.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
};

const useStyles = makeStyles((theme) => ({
  root: {
    // backgroundColor: theme.palette.background.dark,
    // paddingTop: theme.spacing(3),
    // paddingBottom: theme.spacing(3)
  },
  queryField: {
    width: 500
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  popper: {
    padding: theme.spacing(5, 3),
  }
}));

const ListView = () => {
  const classes = useStyles();

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getProjects())
  }, [dispatch])

  const projects = useSelector(state => state.projects.projects)
  
  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(10);

  const [query, setQuery] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);

  const [projectToCopy, setProjectToCopy] = useState(null);

  const [projectToDelete, setProjectToDelete] = useState(null);

  const [isCopying, setIsCopying] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [sort, setSort] = useState(sortOptions[0].value);

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    event.persist();
    setSort(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const handleOnClickDelete = (event, ptd) => {
    setProjectToDelete(ptd)
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  const handleOnClickCopy = (event, ptc) => {
    setProjectToCopy(ptc)
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  const handleOnClickCancelCopy = () => {
    setAnchorEl(null)
    setProjectToCopy(null)
  }

  const handleOnClickCancelDelete = () => {
    setAnchorEl(null)
    setProjectToDelete(null)
  }

  const handleOnClickConfirmDelete = async () => {
    setAnchorEl(null)
    setIsDeleting(true)

    try {
      await dispatch(deleteProject({ projectId: projectToDelete.id }))
    } catch (error) {
      console.log({ error })
    } finally {
      setProjectToDelete(null)
      setIsDeleting(false)
    }
  }

  const handleOnClickConfirmCopy = async () => {
    setAnchorEl(null)
    setIsCopying(true)

    try {
      await dispatch(copyProject({ projectId: projectToCopy.id }))
    } catch (error) {
      console.log({ error })
    } finally {
      setProjectToCopy(null)
      setIsCopying(false)
    }
  }

  const filteredProjects = applyFilters(projects, query);
  const sortedProjects = applySort(filteredProjects, sort);
  const paginatedProjects = applyPagination(sortedProjects, page, limit);

  const popperIsOpen = Boolean(anchorEl)

  return (
    <Page
      className={classes.root}
      title="Projects"
    >
      <Container maxWidth="lg">
        <Box mt={6} mb={6}>
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
        <Card
          className={clsx(classes.root)}
        >
          <CardContent>
            <Box
            p={2}
            minHeight={56}
            display="flex"
            alignItems="center"
          >
            <TextField
              className={classes.queryField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon
                      fontSize="small"
                      color="action"
                    >
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                )
              }}
              onChange={handleQueryChange}
              placeholder="Search projects"
              value={query}
              variant="outlined"
            />
            <Box flexGrow={1} />
            <TextField
              label="Sort By"
              name="sort"
              onChange={handleSortChange}
              select
              SelectProps={{ native: true }}
              value={sort}
              variant="outlined"
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </TextField>
          </Box>
            <PerfectScrollbar>
            <Box minWidth={700}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell align='right'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedProjects.map((project) => {
                      const projectAddress = project.addresses.find(({ type }) => type === 'project')
                      
                    return (
                      <TableRow
                        hover
                        key={project.id}
                      >
                        <TableCell>
                          <Box
                            display="flex"
                            alignItems="center"
                          >
                            <div>
                              <Link
                                color="inherit"
                                component={RouterLink}
                                to={`/app/management/projects/${project.id}`}
                                variant="h6"
                              >
                                {project.name}
                              </Link>
                            </div>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {projectAddress &&
                            <Box
                              alignItems="flex-start"
                              display="flex"
                              flexDirection="column"
                            >
                              <Typography
                                variant="h6"
                              >
                                {projectAddress?.name}
                              </Typography>
                              <Typography
                                variant="h5"
                              >
                                {projectAddress?.companyName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                              >
                                {`${projectAddress?.address}${projectAddress?.address2 ? ` ${projectAddress?.address2}` : ''}, ${projectAddress?.city}, ${projectAddress?.state} ${projectAddress?.postalCode}`}
                              </Typography>
                            </Box>
                          }
                        </TableCell>
                        <TableCell>
                          {PROJECT_TYPES.find(el => el.value === project.type).label}
                        </TableCell>
                        <TableCell>
                          {project.code}
                        </TableCell>
                        <TableCell align="right" >
                          <Box display='flex' justifyContent='flex-end'>
                            {isDeleting && projectToDelete?.id === project.id ? <CircularProgress size='sm' /> : (
                              <IconButton
                                disabled={isDeleting}
                                onClick={(event) => handleOnClickDelete(event, project)}
                              >
                                <SvgIcon fontSize="small">
                                  <TrashIcon />
                                </SvgIcon>
                              </IconButton>
                            )}
                            {isCopying && projectToCopy?.id === project.id ? <CircularProgress size='sm' /> : (
                              <IconButton onClick={event => handleOnClickCopy(event, project)}>
                                <SvgIcon fontSize='small'>
                                  <ZapIcon />
                                </SvgIcon>
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </PerfectScrollbar>
            <TablePagination
              component="div"
              count={filteredProjects.length}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 25]}
            />
            <Popper open={popperIsOpen} anchorEl={anchorEl}>
              {!!projectToDelete &&
                <Paper className={classes.popper} elevation={1}>
                  <Typography>Delete selected project?</Typography>
                  <div style={{ float: 'right' }}>
                    <IconButton onClick={handleOnClickCancelDelete}>
                      <SvgIcon style={{ color: 'red ' }} fontSize="small">
                        <XIcon />
                      </SvgIcon>
                    </IconButton>
                    <IconButton onClick={handleOnClickConfirmDelete}>
                      <SvgIcon style={{ color: 'green' }} fontSize="small">
                        <CheckIcon />
                      </SvgIcon>
                    </IconButton>
                  </div>
                </Paper>
              }
              {!!projectToCopy &&
                <Paper className={classes.popper} elevation={1}>
                  <Typography>Copy selected project?</Typography>
                  <div style={{ float: 'right' }}>
                    <IconButton onClick={handleOnClickCancelCopy}>
                      <SvgIcon style={{ color: 'red ' }} fontSize="small">
                        <XIcon />
                      </SvgIcon>
                    </IconButton>
                    <IconButton onClick={handleOnClickConfirmCopy}>
                      <SvgIcon style={{ color: 'green' }} fontSize="small">
                        <CheckIcon />
                      </SvgIcon>
                    </IconButton>
                  </div>
                </Paper>}
            </Popper>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};

export default ListView;
