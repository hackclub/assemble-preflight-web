import Cookies from 'cookies';
import crypto from 'node:crypto';

const getAuthorizeURL = (
  req,
  res,
  query
) => {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  const cookies = new Cookies(req, res);
  const oneHrInMs = 60 * 60 * 1000;
  cookies.set('indocs_code_verifier', codeVerifier, {
    overwrite: true,
    httpOnly: true,
    expires: new Date(Date.now() + oneHrInMs),
  });

  if (query.on_login) {
    cookies.set('indocs_login_redirect', query.on_login, {
      overwrite: true,
    });
  }

  const authorizeQuery = new URLSearchParams({
    app_id: 'com.hackclub.AssembleTicketing',
    code_challenge: codeChallenge,
  });

  return `https://allotrope.id/oauth/authorize?${authorizeQuery.toString()}`;
};

export default getAuthorizeURL;
