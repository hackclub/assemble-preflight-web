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
  fetch("https://api.ticketing.assemble.hackclub.com/tickets/qr", {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.text())
    .then((response) => {
      let json = Try(() => JSON.parse(response));
      if (json) {
        res.status(400).send("ERROR\n\n" + JSON.stringify(json, null, 4));
      } else {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(response);
      }
    });
}
