import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
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
import {
  Check as CheckIcon,
  Trash as TrashIcon,
  Search as SearchIcon,
  X as XIcon
} from 'react-feather';
import getInitials from 'src/utils/getInitials';
import useAuth from 'src/hooks/useAuth'
import api from 'src/utils/api'
import { useDispatch, useSelector } from 'src/store'
import { getAccounts } from 'src/slices/account'

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

const applyFilters = (users, query) => {
  return users.filter((user) => {
    let matches = true;

    if (query) {
      const properties = ['email'];
      // const properties = ['email', 'name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (user[property].toLowerCase().includes(query.toLowerCase())) {
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

const applyPagination = (users, page, limit) => {
  return users.slice(page * limit, page * limit + limit);
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

const applySort = (users, sort) => {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = users.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
};

const useStyles = makeStyles((theme) => ({
  root: {},
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

const Results = ({
  className,
  users,
  ...rest
}) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [sort, setSort] = useState(sortOptions[0].value);
  const { user: authUser } = useAuth()
  const account = useSelector(state => state.account.activeAccount)
  const dispatch = useDispatch()

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

  const handleOnClickDelete = (event, utd) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setUserToDelete(utd)
  }

  const handleOnClickCancelDelete = () => {
    setAnchorEl(null)
    setUserToDelete(null)
  }

  const handleOnClickConfirmDelete = async () => {
    setAnchorEl(null)
    setIsDeleting(true)

    try {
      await api.delete(`account/${account.id}/user/${userToDelete.id}`)

      dispatch(getAccounts())
    } catch (error) {
      console.log({ error })
    } finally {
      setUserToDelete(null)
      setIsDeleting(false)
    }
  }

  const filteredUsers = applyFilters(users, query);
  const sortedUsers = applySort(filteredUsers, sort);
  const paginatedUsers = applyPagination(sortedUsers, page, limit);

  const popperIsOpen = Boolean(anchorEl)

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
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
          placeholder="Search users"
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
                <TableCell>
                  Name
                </TableCell>
                <TableCell align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => {
                return (
                  <TableRow
                    hover
                    key={user.id}
                  >
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                      >
                        <Avatar
                          className={classes.avatar}
                          src={user.avatar}
                        >
                          {getInitials(user.name)}
                        </Avatar>
                        <div>
                          <Link
                            color="inherit"
                            component={RouterLink}
                            to="/app/management/users/1"
                            variant="h6"
                          >
                            {user.name}
                          </Link>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                          >
                            {user.email}
                          </Typography>
                        </div>
                      </Box>
                    </TableCell>
                    {/* <TableCell>
                      {`${user.city}, ${user.state}, ${user.country}`}
                    </TableCell> */}
                    <TableCell align="right">
                      {isDeleting && userToDelete?.id === user.id ? <CircularProgress size='sm' /> : (
                        <IconButton
                          disabled={user.id === authUser.id}
                          onClick={(event) => handleOnClickDelete(event, user)}
                        >
                          <SvgIcon fontSize="small">
                            <TrashIcon />
                          </SvgIcon>
                        </IconButton>
                      )}
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
        count={filteredUsers.length}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <Popper open={popperIsOpen} anchorEl={anchorEl}>
        <Paper className={classes.popper} elevation={1}>
          <Typography>Delete selected user?</Typography>
          <div style={{ float: 'right'}}>
            <IconButton onClick={handleOnClickCancelDelete}>
              <SvgIcon style={{ color: 'red ' }}fontSize="small">
                <XIcon />
              </SvgIcon>
            </IconButton>
            <IconButton onClick={handleOnClickConfirmDelete}>
              <SvgIcon style={{ color: 'green'}} fontSize="small">
                <CheckIcon />
              </SvgIcon>
            </IconButton>
          </div>
        </Paper>
      </Popper>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

Results.defaultProps = {
  users: []
};

export default Results;
