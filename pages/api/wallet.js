import Cookies from "cookies";
import fetch from "node-fetch";

export function Try(fn) {
  try {
    return fn();
  } catch (e) {
    return null;
  }
}

export default async function (req, res) {
  const cookies = new Cookies(req, res);
  const token = cookies.get("assemble_access_token");
  fetch("https://api.ticketing.assemble.hackclub.com/tickets/wallet", {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => {
        if (response.status == 200) {
            res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
            const headers = Object.fromEntries(response.headers);
            for (const header in headers) {
                res.setHeader(header, headers[header]);
            }
            return res.send(await response.buffer());
        } else {
            response.json().then(json => {
                res.status(404).json(json);
            })
        }
    });
}
