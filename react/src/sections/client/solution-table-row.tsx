import { Box, IconButton, Switch, Tooltip, Typography } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

import Iconify from 'components/iconify'
import ResponseHandler from 'components/response-handler'
import { UnitCostTypeEnum, useOrganizationSolutionsQuery } from 'generated/graphql'
import React from 'react'
import { APIClientSolution } from 'sections/client/types'
import { action, primary } from 'theme/palette'
import { CATEGORY_CODE_TO_LABEL, getUnitCostTypeLabel } from 'utils/constants'

const SolutionTooltip: React.FC<{ solutionUuid: string }> = ({ solutionUuid }) => {
  const result = useOrganizationSolutionsQuery()

  return (
    <Tooltip
      arrow
      title={
        <ResponseHandler {...result}>
          {({ organization }) => {
            const solution = organization.solutions.find(s => s.uuid === solutionUuid)!
            return (
              <Box sx={{ p: 1 }}>
                <Typography variant="subtitle2">
                  Acesta este un pachet si include mai multe servicii:
                  <br />
                </Typography>
                {solution.activities.map(a => (
                  <Typography variant="body2" key={a.uuid}>
                    &nbsp;-&nbsp;{a.name}
                  </Typography>
                ))}
              </Box>
            )
          }}
        </ResponseHandler>
      }
    >
      <Iconify width={24} icon="eva:info-outline" color={primary.main} />
    </Tooltip>
  )
}

type Props = {
  row: APIClientSolution
  onEditRow(clientActivityUuid?: string): void
  onEditLogs: VoidFunction
  canSeeCosts: boolean
}

const SolutionTableRow: React.FC<Props> = ({ row, onEditRow, onEditLogs, canSeeCosts }) => {
  console.log(row)
  return (
    <TableRow sx={{ backgroundColor: action.selected }}>
      <TableCell style={{ width: 150 }}>
        <Switch checked color="success" />
        <IconButton size="small" onClick={onEditLogs} color="warning">
          <Iconify icon="solar:clock-circle-outline" width={24} />
        </IconButton>
      </TableCell>
      <TableCell
        sx={{
          whiteSpace: 'nowrap',
        }}
      >
        <ListItemText
          onClick={() => onEditRow(row.uuid)}
          primary={
            <Box display="flex" alignItems="center">
              <Typography
                component="div"
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {row.solution.name}
              </Typography>
              &nbsp;&nbsp;&nbsp;
              <SolutionTooltip solutionUuid={row.solution.uuid} />
            </Box>
          }
        />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <ListItemText
          primary={
            CATEGORY_CODE_TO_LABEL[
              row.solution.category.code as keyof typeof CATEGORY_CODE_TO_LABEL
            ]
          }
          secondary=""
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      {canSeeCosts && (
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={`${row.unitCost} ${row.unitCostCurrency}`}
            secondary=""
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
      )}
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <ListItemText
          primary={getUnitCostTypeLabel(UnitCostTypeEnum.FIXED)}
          secondary=""
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <ListItemText
          primary={row.quantity}
          secondary=""
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>
    </TableRow>
  )
}

export default SolutionTableRow
