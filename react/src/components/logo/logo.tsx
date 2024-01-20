import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'routes/components';

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ sx }) => {
    const logo = (
      <Box
        component="img"
        src="/logo/logo_single.svg"
        sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
      />
    );


    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
