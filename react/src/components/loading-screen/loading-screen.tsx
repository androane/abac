import Box, { BoxProps } from '@mui/material/Box'
import Lottie from 'lottie-react'
import loading from './loading.json'

const LoadingScreen: React.FC<BoxProps> = ({ sx, ...other }) => {
  return (
    <Box
      sx={{
        px: 5,
        width: 1,
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
      {...other}
    >
      <Lottie animationData={loading} loop autoplay style={{ maxHeight: 400, maxWidth: 400 }} />
    </Box>
  )
}

export default LoadingScreen
