import Box, { BoxProps } from '@mui/material/Box'
import Lottie from 'react-lottie'
import loading from './dots.json'

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loading,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

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
      <Lottie options={defaultOptions} height={400} width={400} />
    </Box>
  )
}

export default LoadingScreen
