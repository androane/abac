import {
  useOrganizationSolutionsQuery,
  useOrganizationUsersQuery,
  useReportGenerateUserReportMutation,
} from 'generated/graphql'
import groupBy from 'lodash/groupBy'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useState } from 'react'
import {
  Checkbox,
  Container,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material'
import CustomBreadcrumbs from 'components/custom-breadcrumbs'
import LoadingButton from '@mui/lab/LoadingButton'
import { useSnackbar } from 'notistack'
import getErrorMessage from 'utils/api-codes'
import { useAuthContext } from 'auth/hooks'
import { CATEGORY_CODE_TO_LABEL } from 'utils/constants'
import ResponseHandler from 'components/response-handler'
import React from 'react'

const ReportsView = () => {
  const { user } = useAuthContext()

  const usersResult = useOrganizationUsersQuery()
  const orgSolutionsResult = useOrganizationSolutionsQuery()

  const [generateReport, { loading }] = useReportGenerateUserReportMutation()

  const { enqueueSnackbar } = useSnackbar()

  const [date, setDate] = useState(new Date())
  const [categoryCodes, setCategoryCodes] = useState<string[]>([])
  const [userUuids, setUserUuids] = useState<string[]>([])
  const [solutionUuids, setSolutionUuids] = useState<string[]>([])
  const [activityUuids, setActivityUuids] = useState<string[]>([])

  const handleChangeCategory = (event: SelectChangeEvent<typeof categoryCodes>) => {
    const {
      target: { value },
    } = event

    if (value.includes('')) {
      setCategoryCodes([])
    } else {
      setCategoryCodes(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      )
    }
  }

  const renderCategories = (selectedIds: string[]) => {
    const selectedItems = user!.categories.filter(c => selectedIds.includes(c.code))
    return selectedItems
      .map(item => CATEGORY_CODE_TO_LABEL[item.code as keyof typeof CATEGORY_CODE_TO_LABEL])
      .join(', ')
  }

  const handleChangeUsers = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event

    if (value.includes('')) {
      setUserUuids([])
    } else {
      setUserUuids(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      )
    }
  }

  const handleChangeActivities = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event

    if (value.includes('')) {
      setSolutionUuids([])
    } else {
      setSolutionUuids(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      )
    }
  }

  const onGenerateReport = async () => {
    try {
      const response = await generateReport({
        variables: {
          month: date.getMonth() + 1,
          year: date.getFullYear(),
          categoryCodes,
          userUuids,
          solutionUuids,
          activityUuids,
        },
      })
      window.open(response.data?.generateReport?.downloadUrl, '_blank')
      enqueueSnackbar('Raportul a fost generat cu succes')
    } catch (error) {
      console.log((error as Error).message)
      enqueueSnackbar(getErrorMessage((error as Error).message), {
        variant: 'error',
      })
    }
  }

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Rapoarte"
        links={[{ name: 'Rapoarte' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <DatePicker
          label="Data"
          minDate={new Date('2024-01-01')}
          disableFuture
          value={date}
          onChange={newDate => newDate && setDate(newDate)}
          slotProps={{ textField: { fullWidth: true } }}
          views={['month', 'year']}
          sx={{
            maxWidth: { md: 180 },
          }}
        />
        <FormControl sx={{ m: 1, width: 200 }}>
          <InputLabel id="report-categories">Domeniu</InputLabel>
          <Select
            multiple
            labelId="report-categories"
            value={categoryCodes}
            onChange={handleChangeCategory}
            renderValue={renderCategories}
            input={<OutlinedInput label="Domeniu" />}
          >
            <MenuItem value="">
              <Checkbox disableRipple size="small" checked={!categoryCodes.length} />
              Toate
            </MenuItem>
            {user?.categories.map(c => (
              <MenuItem key={c.code} value={c.code}>
                <Checkbox disableRipple size="small" checked={categoryCodes.includes(c.code)} />
                {CATEGORY_CODE_TO_LABEL[c.code as keyof typeof CATEGORY_CODE_TO_LABEL]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, width: 200 }}>
          <InputLabel id="report-users">Responsabili</InputLabel>
          <ResponseHandler {...usersResult}>
            {({ organization: { users } }) => {
              return (
                <Select
                  multiple
                  labelId="report-users"
                  value={userUuids}
                  onChange={handleChangeUsers}
                  renderValue={(selectedUuids: string[]) =>
                    users
                      .filter(u => selectedUuids.includes(u.uuid))
                      .map(u => u.name)
                      .join(', ')
                  }
                  input={<OutlinedInput label="Responsabili" />}
                >
                  <MenuItem value="">
                    <Checkbox disableRipple size="small" checked={!userUuids.length} />
                    Toți
                  </MenuItem>
                  {users.map(u => (
                    <MenuItem key={u.uuid} value={u.uuid}>
                      <Checkbox disableRipple size="small" checked={userUuids.includes(u.uuid)} />
                      {u.name}
                    </MenuItem>
                  ))}
                </Select>
              )
            }}
          </ResponseHandler>
        </FormControl>
        <FormControl sx={{ m: 1, width: 200 }}>
          <InputLabel id="report-activities">Servicii</InputLabel>
          <ResponseHandler {...orgSolutionsResult}>
            {({ organization: { solutions: orgSolutions } }) => {
              const grouped = groupBy(orgSolutions, 'category.code')
              return (
                <Select
                  multiple
                  labelId="report-activities"
                  value={solutionUuids}
                  onChange={handleChangeActivities}
                  renderValue={(selectedUuids: string[]) =>
                    orgSolutions
                      .filter(s => selectedUuids.includes(s.uuid))
                      .map(s => s.name)
                      .join(', ')
                  }
                  input={<OutlinedInput label="Servicii" />}
                >
                  <MenuItem value="">
                    <Checkbox disableRipple size="small" checked={!solutionUuids.length} />
                    Toate
                  </MenuItem>
                  {Object.entries(grouped).map(([categoryCode, solutions]) => {
                    return [
                      <ListSubheader>
                        Pachete{' '}
                        {
                          CATEGORY_CODE_TO_LABEL[
                            categoryCode as keyof typeof CATEGORY_CODE_TO_LABEL
                          ]
                        }
                      </ListSubheader>,
                      ...solutions.map(s => (
                        <MenuItem key={s.uuid} value={s.uuid}>
                          <Checkbox
                            disableRipple
                            size="small"
                            checked={solutionUuids.includes(s.uuid)}
                          />
                          {s.name}
                        </MenuItem>
                      )),
                    ]
                  })}
                </Select>
              )
            }}
          </ResponseHandler>
        </FormControl>
      </Stack>
      <br />
      <LoadingButton
        type="submit"
        variant="contained"
        color="success"
        loading={loading}
        onClick={onGenerateReport}
      >
        Generează
      </LoadingButton>
      <br />
    </Container>
  )
}

export default ReportsView
