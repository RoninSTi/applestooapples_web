import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useDispatch } from 'src/store/index'
import { createProjectDocument } from 'src/slices/projects'

import clsx from 'clsx';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  Divider,
  List,
  SvgIcon,
  Typography,
  makeStyles
} from '@material-ui/core';

import {
  PlusCircle as PlusIcon,
} from 'react-feather';

import FileRow from './FileRow'

const useStyles = makeStyles(() => ({
  root: {},
  uploadButton: {
    padding: 0,
    minWidth: '100%'
  }
}));

const UploadModal = ({ isOpen, onCancel, projectId }) => {
  const dispatch = useDispatch()

  const [files, setFiles] = useState([])
  const [completedFiles, setCompletedFiles] = useState([])

  const classes = useStyles()

  const handleSelect = e => {
    const [file] = e.target.files
    const fileParts = file.name.split('.');
    const [fileName, fileType] = fileParts;
    const { size, type: contentType } = file; 

    const data = {
      contentType,
      file,
      fileName,
      fileType,
      size
    }

    setFiles(prev => [...prev, data])
  }

  const handleOnClickCancel = () => {
    onCancel()

    setFiles([])
    setCompletedFiles([])
  }

  const handleOnCancel = fileData => {
    const { fileName } = fileData

    setFiles(prev => {
      const updated = prev.filter(elem => elem.fileName !== fileName)

      return updated
    })
  }

  const handleOnDelete = fileData => {
    const { fileName } = fileData

    setCompletedFiles(prev => {
      const updated = prev.filter(elem => elem.fileName !== fileName)

      return updated
    })
  }

  const handleOnComplete = fileData => {
    setCompletedFiles(prev => {
      const updated = [...prev, fileData]

      return updated
    })
  }

  const handleOnClickFinish = () => {
    completedFiles.forEach(fileData => {
      const { fileName, fileType, size, url } = fileData

      dispatch(createProjectDocument({ fileName, fileType, projectId, size, url }))
    })

    onCancel()
  }

  return (
    <Dialog open={isOpen} fullWidth>
      <Card
        className={clsx(classes.root)}
      >
        <CardHeader title="Upload Files" />
        <Divider />
        {files.length === 0 &&
          <CardContent>
            <Box>
              <Typography>No files selected.  To start, click the + icon.</Typography>
          </Box>
          </CardContent>
          }
          {files.length > 0 &&
            <List>
          {files.map(fileData => <FileRow onCancel={handleOnCancel} onComplete={handleOnComplete} onDelete={handleOnDelete} fileData={fileData} />)}
            </List>
          }
        <Box
          alignItems="center"
          p={2}
          display="flex"
          justifyContent="space-between"
        >
          <div>
              <label htmlFor="btn-upload">
                <input
                  id="btn-upload"
                  name="btn-upload"
                  style={{ display: 'none' }}
                  type="file"
                  onChange={handleSelect} />
                <Button
                  className={classes.uploadButton}
                  color="secondary"
                  component="span" >
                  <SvgIcon fontSize="large">
                    <PlusIcon />
                  </SvgIcon>
                </Button>
              </label>
          </div>
          <div>
            <Button onClick={handleOnClickCancel}>Cancel</Button>
            <Button
              color="secondary"
              disabled={completedFiles.length === 0}
              onClick={handleOnClickFinish}
              variant="contained"
            >Finish</Button>
          </div>
        </Box>
      </Card>
    </Dialog>
  )
}

UploadModal.defaultProps = {
  className: null,
  isOpen: false,
  onCancel: () => { },
  onSubmit: () => { }
}

UploadModal.propTypes = {
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func
}

export default UploadModal
