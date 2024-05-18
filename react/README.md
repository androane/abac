# ABAC Software Solutions

The most amazing software for accounting companies!

## Production

Production is hosted at DigitalOcean.
Just push changes to the production branch and and auto-deploy will be triggered. Front-end will be automatically built as well

## Development

- Add `127.0.0.1     abac.local` to `/etc/hosts`
- Run backend with `make up`
- Run frontend with `npm run dev`
- Backend serves the admin and the graphql API at `/admin`, respectively `/graphql`
