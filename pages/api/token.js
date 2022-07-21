import Cookies from 'cookies';

export default async function (req, res) {
    const cookies = new Cookies(req, res);
    res.send(cookies.get('assemble_access_token'));
}