import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import { Box, BoxProps } from '@mui/material'
import loading from './cat.json'

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
      <Lottie animationData={loading} loop autoplay style={{ maxHeight: 400, maxWidth: 400 }} />
    </Box>
  )
}

export default SplashScreen
