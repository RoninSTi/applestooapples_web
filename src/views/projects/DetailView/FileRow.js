import React, { useCallback, useEffect, useState } from 'react'

import api from 'src/utils/api'
import axios from 'axios'

import { useDispatch } from 'src/store'
import { createProjectDocument } from 'src/slices/projects'

import {
  CircularProgress,
  TableCell,
  TableRow,
} from '@material-ui/core';

const FileRow = ({ file, fileName, fileType, onComplete, projectId }) => {
  const dispatch = useDispatch()

  const [progress, setProgress] = useState(0)

  const upload = useCallback(async () => {
    const response = await api({
      method: 'post',
      url: 'upload/signedurl',
      data: {
        fileName,
        fileType
      }
    })

    const { signedRequest, url } = response.data
    // Put the fileType in the headers for the upload
    const options = {
      headers: {
        'Content-Type': fileType
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

    dispatch(createProjectDocument({ fileName, fileType, projectId, url }))

    onComplete({ fileName })
  }, [dispatch, file, fileName, fileType, onComplete, projectId])

  useEffect(() => {
    if (file && fileName && fileType) {
      upload()
    }
  }, [file, fileName, fileType, upload])

  return (
    <TableRow>
      <TableCell>
        <CircularProgress color="primary" size={20} variant="determinate" value={progress} />
      </TableCell>
      <TableCell>
        {fileName}
      </TableCell>
      <TableCell>{fileType}</TableCell>
      <TableCell />
    </TableRow>
  )
}

export default FileRow
