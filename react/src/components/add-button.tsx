import { Box, IconButton, Stack, Typography } from '@mui/material'
import Iconify from 'components/iconify'

type Props = {
  count?: number
  label: string
  onClick: () => void
  withSpacing?: boolean
}

const AddButton: React.FC<Props> = ({ count, label, onClick, withSpacing = true }) => {
  return (
    <Stack direction="row" alignItems="center" sx={{ mb: withSpacing ? 3 : 0 }}>
      <Stack flexGrow={1}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          flexGrow={1}
          onClick={() => onClick()}
          sx={{ cursor: 'pointer' }}
        >
          <Typography variant="h6">{label}</Typography>

          <IconButton
            size="small"
            color="primary"
            sx={{
              width: 24,
              height: 24,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            <Iconify icon="mingcute:add-line" />
          </IconButton>
        </Stack>

        {count !== undefined && (
          <Box
            sx={{ typography: 'body2', color: 'text.disabled', mt: 0.5 }}
          >{`${count} ${label}`}</Box>
        )}
      </Stack>
    </Stack>
  )
}

export default AddButton
