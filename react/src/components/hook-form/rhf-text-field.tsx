import { Controller, useFormContext } from 'react-hook-form'

import TextField, { TextFieldProps } from '@mui/material/TextField'

type Props = TextFieldProps & {
  name: string
  isNullableNumber?: boolean
}

export default function RHFTextField({
  name,
  helperText,
  type,
  disabled,
  variant,
  isNullableNumber = false,
  ...other
}: Props) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          type={type}
          value={!isNullableNumber && type === 'number' && field.value === 0 ? '' : field.value}
          onChange={event => {
            if (!isNullableNumber && type === 'number') {
              field.onChange(Number(event.target.value))
            } else {
              field.onChange(event.target.value)
            }
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          InputLabelProps={{ shrink: true }}
          disabled={disabled}
          variant={disabled ? 'filled' : variant}
          {...other}
        />
      )}
    />
  )
}
