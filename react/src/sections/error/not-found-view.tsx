import { m } from 'framer-motion'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { RouterLink } from 'routes/components'

import { PageNotFoundIllustration } from 'assets/illustrations'

import { MotionContainer, varBounce } from 'components/animate'

export default function NotFoundView() {
  return (
    <MotionContainer>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Ne pare rau, Pagina Nu Exista!
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          Ne pare rau, nu am putut gasi pagina pe care o cauti. Poate ai scris gresit adresa URL?
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

      <Button component={RouterLink} href="/" size="large" variant="contained">
        Acasa
      </Button>
    </MotionContainer>
  )
}
