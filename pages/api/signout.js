import Cookies from 'cookies';

export default async function (req, res) {
    const cookies = new Cookies(req, res);
    cookies.set('assemble_access_token', '', {
        overwrite: true,
        expires: Date.now(),
        httpOnly: true,
    });
    cookies.set('hackclub-ticketing-auth', '', {
        overwrite: true,
        expires: Date.now(),
        httpOnly: true,
        domain: '.assemble.hackclub.com'
    }); 
    res.redirect('/');
}