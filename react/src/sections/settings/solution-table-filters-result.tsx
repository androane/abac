import { useCallback } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack, { StackProps } from '@mui/material/Stack'

import Iconify from 'components/iconify'
import { SolutionTableFilters } from './types'

type Props = StackProps & {
  filters: SolutionTableFilters
  onFilters: (name: string, value: string) => void
  onResetFilters: VoidFunction
  results: number
}

const SolutionTableFiltersResult: React.FC<Props> = ({
  filters,
  onFilters,
  onResetFilters,
  results,
  ...other
}) => {
  const handleRemoveKeyword = useCallback(() => {
    onFilters('name', '')
  }, [onFilters])

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          rezultate găsite
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.name && (
          <Block label="Cuvânt cheie:">
            <Chip label={filters.name} size="small" onDelete={handleRemoveKeyword} />
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Resetează
        </Button>
      </Stack>
    </Stack>
  )
}

type BlockProps = StackProps & {
  label: string
}

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  )
}

export default SolutionTableFiltersResult
