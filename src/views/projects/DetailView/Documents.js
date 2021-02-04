import React, { useState, useEffect } from 'react';

import mime from 'mime-types';

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
  IconButton,
  Link,
  Paper,
  Popper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  Check as CheckIcon,
  Trash as TrashIcon,
  X as XIcon,
} from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { deleteProjectDocument } from 'src/slices/projects'

import FileRow from './FileRow'
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

const Documents = ({ project }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null)
  const [documents, setDocuments] = useState([])
  const [documentToDelete, setDocumentToDelete] = useState(null)

  const [files, setFiles] = useState([])

  useEffect(() => {
    if (project) {
      setDocuments(project?.documents || [])
    }
  }, [project, setDocuments])

  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

  const handleOnClickCancelDelete = () => {
    setAnchorEl(null)
    setDocumentToDelete(null)
  }

  const handleOnClickDelete = (event, dtd) => {
    setDocumentToDelete(dtd)
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  const handleOnClickDeleteDocument = () => {
    dispatch(deleteProjectDocument({ documentId: documentToDelete.id , projectId: project.id }))
    setDocumentToDelete(null)
    setAnchorEl(null)

    enqueueSnackbar('Document deleted', {
      variant: 'success'
    })
  }

  const handleOnComplete = ({ fileName }) => {
    setFiles(prev => {
      const updated = prev.filter(({ fileName: fn }) => fileName !== fn)

      return updated
    });

    enqueueSnackbar('Document added', {
      variant: 'success'
    });
  }

  // Perform the upload
  const handleUpload = async e => {
    const [file] = e.target.files
    const fileParts = file.name.split('.');
    const [fileName, fileType] = fileParts;
    const { type: contentType } = file; 

    const data = {
      contentType, file, fileName, fileType
    }

    setFiles(prev => [...prev, data])
  } 

  const popperIsOpen = Boolean(anchorEl)

  return (
    <Page
      className={classes.root}
      title="Project documents"
    >
      <Container maxWidth="lg">
        <Box mb={4}>
          <Card>
            <CardHeader
              action={
                <>
                  <label htmlFor="btn-upload">
                    <input
                      id="btn-upload"
                      name="btn-upload"
                      style={{ display: 'none' }}
                      type="file"
                      onChange={handleUpload} />
                    <Button
                      className="btn-choose"
                      color="secondary"
                      component="span" >
                      Choose Files
          </Button>
                  </label>
                </>
              } />
            <Divider />
            <CardContent>
              {(documents.length > 0 || files.length > 0) ? (
                <PerfectScrollbar>
                  <Box minWidth={700}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell>File name</TableCell>
                          <TableCell>File type</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {files.map(({ contentType, file, fileName, fileType }) => <FileRow
                          key={fileName}
                          contentType={contentType}
                          file={file}
                          fileName={fileName}
                          fileType={fileType}
                          onComplete={handleOnComplete}
                          projectId={project.id}
                        />)}
                        {documents.map((document) => {
                          return (
                            <TableRow
                              hover
                              key={document.id}
                            >
                              <TableCell />
                              <TableCell>
                                <Link download={`${document.fileName}`} href={document.url} target="_blank">
                                  {document.fileName}
                                </Link>
                              </TableCell>
                              <TableCell>{document.fileType}</TableCell>
                              <TableCell align="right">
                                <IconButton
                                  onClick={(event) => handleOnClickDelete(event, document)}
                                >
                                  <SvgIcon fontSize="small">
                                    <TrashIcon />
                                  </SvgIcon>
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Box>
                </PerfectScrollbar>) : (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  >
                    No documents added.
                  </Typography>
                )}
            </CardContent>
          </Card>
        </Box>
      </Container>
      <Popper open={popperIsOpen} anchorEl={anchorEl}>
        {!!documentToDelete &&
          <Paper className={classes.popper} elevation={1}>
            <Typography>Delete selected document?</Typography>
            <div style={{ float: 'right' }}>
              <IconButton onClick={handleOnClickCancelDelete}>
                <SvgIcon style={{ color: 'red ' }} fontSize="small">
                  <XIcon />
                </SvgIcon>
              </IconButton>
              <IconButton onClick={handleOnClickDeleteDocument}>
                <SvgIcon style={{ color: 'green' }} fontSize="small">
                  <CheckIcon />
                </SvgIcon>
              </IconButton>
            </div>
          </Paper>
        }
      </Popper>
    </Page>
  );
};

export default Documents
