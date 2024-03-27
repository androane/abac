import { m } from 'framer-motion'
import Lottie from 'react-lottie'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { RouterLink } from 'routes/components'

import { MotionContainer, varBounce } from 'components/animate'
import { LANDING_PAGE } from 'routes/paths'
import notfound from './notfound.json'

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: notfound,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
}

const NotFoundView = () => {
  return (
    <MotionContainer>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Ne pare rău, Pagina Nu Există!
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          Ne pare rău, nu am putut găsi pagina pe care o cauți. Poate ai scris greșit adresa URL?
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Lottie options={defaultOptions} height={400} width={400} />
      </m.div>

      <Button
        sx={{ mt: 4 }}
        component={RouterLink}
        href={LANDING_PAGE}
        size="large"
        variant="contained"
      >
        Pagina Principală
      </Button>
    </MotionContainer>
  )
}

export default NotFoundView
