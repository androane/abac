import { closeSnackbar, SnackbarProvider as NotistackProvider } from 'notistack'
import { useRef } from 'react'
import Lottie from 'lottie-react'
import IconButton from '@mui/material/IconButton'
import success from './success.json'
import error from './error.json'

import Iconify from '../iconify'
import { StyledIcon, StyledNotistack } from './styles'

type Props = {
  children: React.ReactNode
}

const SnackbarProvider: React.FC<Props> = ({ children }) => {
  const notistackRef = useRef<any>(null)

  return (
    <NotistackProvider
      ref={notistackRef}
      maxSnack={5}
      preventDuplicate
      autoHideDuration={4000}
      variant="success" // Set default variant
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      iconVariant={{
        info: (
          <StyledIcon color="info">
            <Iconify icon="eva:info-fill" width={24} />
          </StyledIcon>
        ),
        success: (
          <Lottie animationData={success} loop={false} autoplay style={{ width: 50, height: 50 }} />
        ),
        warning: (
          <StyledIcon color="warning">
            <Iconify icon="eva:alert-triangle-fill" width={24} />
          </StyledIcon>
        ),
        error: (
          <Lottie animationData={error} loop={false} autoplay style={{ width: 50, height: 50 }} />
        ),
      }}
      Components={{
        default: StyledNotistack,
        info: StyledNotistack,
        success: StyledNotistack,
        warning: StyledNotistack,
        error: StyledNotistack,
      }}
      // with close as default
      action={snackbarId => (
        <IconButton size="small" onClick={() => closeSnackbar(snackbarId)} sx={{ p: 0.5 }}>
          <Iconify width={16} icon="mingcute:close-line" />
        </IconButton>
      )}
    >
      {children}
    </NotistackProvider>
  )
}

export default SnackbarProvider
