import React, { forwardRef } from 'react'
import TextField from '@material-ui/core/TextField'

const PhoneInput = (props, ref) => {
  return (
    <TextField
      {...props}
      inputRef={ref}
      fullWidth
      label='Phone Number'
      variant='outlined'
      name='phone'
    />
  )
}
export default forwardRef(PhoneInput)