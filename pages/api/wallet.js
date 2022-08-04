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
    .then((response) => response.text())
    .then((response) => {
      res.send(response);
    });
}
