import React from 'react'

import { Typography } from '@mui/material'

type Props = {
  to: string
  label: string
  className?: string
}

const ExternalNavLink: React.FC<Props> = ({ to, label, className }) => {
  return (
    <a target="_blank" rel="noopener noreferrer" href={to}>
      <Typography
        component="span"
        color="secondary"
        className={className}
        sx={{ decoration: 'none', pointer: 'cursor' }}
      >
        {label}
      </Typography>
    </a>
  )
}

export default ExternalNavLink
