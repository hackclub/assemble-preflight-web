import getAuthorizeURL from '../lib/server/auth.js'
import { useEffect } from 'react'
import getCookie from '../lib/cookie.js'

export default function Login ({ loginUrl, error }) {
    useEffect(() => {
      let cookie = getCookie('assemble_access_token');
      if (cookie && !error) {
        location.replace('/');
      } else {
        location.replace(loginUrl);
      }
    }, []);
    return (
        <div>
            <h1>Login</h1>
            <p>
                <a href={loginUrl}>Login with Allotrope</a>
            </p>
            {error && <p>{error}</p>}
        </div>
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