import { m } from 'framer-motion'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { RouterLink } from 'routes/components'

import { PageNotFoundIllustration } from 'assets/illustrations'

import { MotionContainer, varBounce } from 'components/animate'
import { LANDING_PAGE } from 'routes/paths'

const NotFoundView = () => {
  return (
    <MotionContainer>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Ne pare rau, Pagina Nu Exista!
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          Ne pare rău, nu am putut găsi pagina pe care o cauți. Poate ai scris greșit adresa URL?
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <PageNotFoundIllustration
          sx={{
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />
      </m.div>

      <Button component={RouterLink} href={LANDING_PAGE} size="large" variant="contained">
        Pagina Principală
      </Button>
    </MotionContainer>
  )
}

export default NotFoundView
