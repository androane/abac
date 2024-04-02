import { useReportGenerateUserReportMutation } from 'generated/graphql'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useState } from 'react'
import { Container } from '@mui/material'
import CustomBreadcrumbs from 'components/custom-breadcrumbs'
import LoadingButton from '@mui/lab/LoadingButton'
import { useSnackbar } from 'notistack'
import getErrorMessage from 'utils/api-codes'
import ExternalNavLink from 'components/external-nav-link'

const ReportsView = () => {
  const [generateReport, { loading }] = useReportGenerateUserReportMutation()

  const { enqueueSnackbar } = useSnackbar()

  const [date, setDate] = useState(new Date())
  const [downloadUrl, setDownloadUrl] = useState('')

  const onGenerateReport = async () => {
    try {
      const response = await generateReport({
        variables: {
          month: date.getMonth() + 1,
          year: date.getFullYear(),
        },
      })
      setDownloadUrl(response.data?.generateReport?.downloadUrl || '')
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
      <br />
      <br />
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
      {downloadUrl && <ExternalNavLink to={downloadUrl} label="Descarcă raportul" />}
    </Container>
  )
}

export default ReportsView
