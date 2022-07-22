import getAuthorizeURL from '../lib/server/auth.js'
import { useEffect } from 'react'
import getCookie from '../lib/cookie.js'
import { Box, Container, Heading, Grid, Input, Button } from 'theme-ui'

export default function Login({ loginUrl, error }) {
  useEffect(() => {
    try {
      let cookie = getCookie('assemble_access_token');
      if (cookie && !error) {
        location.replace('/');
      } else {
        location.replace(loginUrl);
      }
    } catch (err) {
      location.replace(loginUrl);
    }
  }, []);
  return (
    <Box py={3} sx={{ minHeight: '100vh', backgroundImage: 'linear-gradient(90deg, rgba(2,0,36,0.37718837535014005) 0%, rgba(2,0,36,0.36318277310924374) 35%, rgba(2,0,36,0.36878501400560226) 100%), url(https://cloud-2ppyw38ar-hack-club-bot.vercel.app/0golden-bay.png)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundSize: 'cover' }}>
      <Heading sx={{ color: 'white' }}>
        Redirecting...
      </Heading>
      <Box>
        Not working? <a href={loginUrl} style={{ color: '#fa4639' }}>Click here</a> to access it.
      </Box>
      {error && <Box>{error}</Box>}
    </Box>
  )
}

export function getServerSideProps(ctx) {
  const props = {
    loginUrl: getAuthorizeURL(ctx.req, ctx.res, ctx.query),
    error: ctx?.query?.error?.toString() || ''
  };

  return {
    props
  };
}