import Cookies from 'cookies';
import crypto from 'node:crypto';
import fetch from 'node-fetch';

export default function (req, res) {
    const cookies = new Cookies(req, res);
    const { auth_code } = req.query;
    const codeVerifier = cookies.get('indocs_code_verifier');
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');
    const response = fetch(`https://api.allotrope.id/oauth/token?auth_code=${encodeURIComponent(auth_code)}&code_verifier=${encodeURIComponent(codeVerifier)}&code_challenge=${encodeURIComponent(codeChallenge)}`).then(response => response.json());
    res.json(response);
}