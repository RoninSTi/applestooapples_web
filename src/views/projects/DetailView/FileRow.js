import React, { useCallback, useEffect, useState } from 'react'

import api from 'src/utils/api'
import axios from 'axios'

import { useDispatch } from 'src/store'
import { createProjectDocument } from 'src/slices/projects'

import { useSnackbar } from 'notistack'

import {
  Avatar,
  IconButton,
  LinearProgress,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import {
  Check as CheckIcon,
  File as FileIcon,
  XCircle as CancelIcon,
  PlusCircle as PlusIcon,
  Trash as DeleteIcon,
  Upload as UploadIcon,
  X as XIcon,
} from 'react-feather';

const CancelToken = axios.CancelToken;

const source = CancelToken.source();

const useStyles = makeStyles((theme) => ({
  progress: {
    margin: '8px 16px'
  }
}));

const STATUS = {
  CANCELLED: 'CANCELLED',
  COMPLETE: 'COMPLETE',
  PENDING: 'PENDING',
  UPLOADING: 'UPLOADING',
}

const FileRow = ({ fileData, onCancel, onComplete, onDelete }) => {
  const { contentType, file, fileName, fileType } = fileData;

  const classes = useStyles()

  const dispatch = useDispatch()

  const { enqueueSnackbar } = useSnackbar();

  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState(STATUS.PENDING)
  const [url, setUrl] = useState(null)

  const upload = useCallback(async () => {
    setStatus(STATUS.UPLOADING)

    const response = await api({
      method: 'post',
      url: 'upload/signedurl',
      data: {
        fileName,
        contentType
      }
    })

    const { signedRequest, url: returnedUrl } = response.data

    setUrl(returnedUrl)

    const options = {
      cancelToken: source.token,
      headers: {
        'Content-Type': contentType
      },
      onUploadProgress: (progressEvent) => {
        const totalLength = progressEvent.lengthComputable
          ? progressEvent.total
          : progressEvent.target.getResponseHeader('content-length') ||
          progressEvent.target.getResponseHeader('x-decompressed-content-length')
        if (totalLength !== null) {
          const progressData = Math.round((progressEvent.loaded * 100) / totalLength)

          setProgress(progressData)
        }
      }
    };

    await axios.put(signedRequest, file, options)
  }, [dispatch, file, fileName, fileType, setUrl])

  useEffect(() => {
    if (file && fileName && fileType) {
      upload()
    }
  }, [file, fileName, fileType, upload])

  useEffect(() => {
    if (progress === 100) {
      setStatus(STATUS.COMPLETE)

      onComplete({
        ...fileData, 
        url
      })

      enqueueSnackbar('File upload complete', {
        variant: 'success'
      });
    } 
  }, [progress, setStatus])

  const handleOnClickCancel = () => {
    source.cancel()

    onCancel(fileData)

    enqueueSnackbar('Operation cancelled', {
      variant: 'warning'
    });
  }

  const handleOnClickDelete = () => {
    onDelete(fileData)

    enqueueSnackbar('File removed', {
      variant: 'warning'
    });
  }

  return (
    <div>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <FileIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={fileName} />
        <ListItemSecondaryAction>
          {status === STATUS.UPLOADING && 
            <IconButton edge="end" aria-label="delete" onClick={handleOnClickCancel}>
              <CancelIcon />
            </IconButton>}
          {status === STATUS.COMPLETE &&
            <IconButton edge="end" aria-label="delete" onClick={handleOnClickDelete}>
              <DeleteIcon />
            </IconButton>
          }
        </ListItemSecondaryAction>
      </ListItem>
      {status === STATUS.UPLOADING &&
        <LinearProgress className={classes.progress} variant="determinate" value={progress} />
      }
    </div>

  )
}

export default FileRow
