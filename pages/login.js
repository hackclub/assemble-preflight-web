import getAuthorizeURL from '../lib/server/auth.js'

export default function Login ({ loginUrl, error }) {
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