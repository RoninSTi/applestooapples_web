import React, { useState, useEffect } from 'react';

import { useDispatch } from 'src/store/index'
import { useSnackbar } from 'notistack';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';

import PerfectScrollbar from 'react-perfect-scrollbar';

import { createProjectSpecification } from 'src/slices/projects'

import AddRoomModal from '../CreateView/AddRoomModal'
import SpecificationRoom from '../CreateView/SpecificationRoom'
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

  const [roomSpecificationIsOpen, setRoomSpecificationIsOpen] = useState(false)
  
  const [specifications, setSpecifications] = useState([])

  useEffect(() => {
    if (project) {
      setSpecifications(project?.specifications)
    }
  }, [project, setSpecifications])

  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

  const handleOnClickAddRoomSpecification = () => {
    setRoomSpecificationIsOpen(true)
  }

  const handleOnSubmitRoomSpecification = async specification => {
      try {
        await dispatch(createProjectSpecification({
          data: specification,
          projectId: project.id
        }));

        enqueueSnackbar('Address added to project', {
          variant: 'success'
        });
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error'
      });
    }
  }

  const handleAddRoomModalOnCancel = () => {
    setRoomSpecificationIsOpen(false);
  }

  return (
    <Page
      className={classes.root}
      title="Specifications"
    >
      <Container maxWidth="lg">
        <Box mb={4}>
          <Card>
            <CardHeader
              action={<Button color="secondary" onClick={handleOnClickAddRoomSpecification}>Add A Room Specification</Button>} />
            <Divider />
            <CardContent>
              {specifications.length > 0 ? (
                <PerfectScrollbar>
                  <Box minWidth={700}>
                  <TableContainer>
                    <Table aria-label="collapsible table">
                      <TableHead>
                        <TableRow>
                          <TableCell>More Info</TableCell>
                          <TableCell>Room</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {specifications.map((specification) => (
                          <SpecificationRoom key={specification.id} projectId={project.id} specification={specification} />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  </Box>
                </PerfectScrollbar>) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  >
                    No specifications added.
                  </Typography>
                )}
            </CardContent>
          </Card>
        </Box>
      </Container>

      <AddRoomModal 
        isOpen={roomSpecificationIsOpen} 
        onCancel={handleAddRoomModalOnCancel} 
        onSubmit={handleOnSubmitRoomSpecification}
      />
    </Page>
  );
};

export default Specifications
