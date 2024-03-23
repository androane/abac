import { useEffect, useState } from 'react'
import Lottie from 'react-lottie'
import { Box, BoxProps } from '@mui/material'
import loading from './cat.json'

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: loading,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

const SplashScreen: React.FC<BoxProps> = ({ sx }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

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
    >
      <Lottie options={defaultOptions} height={400} width={400} />
    </Box>
  )
}

export default SplashScreen
