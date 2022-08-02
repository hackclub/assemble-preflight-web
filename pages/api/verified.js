import Cookies from "cookies";
import fetch from "node-fetch";

export default async function (req, res) {
  const cookies = new Cookies(req, res);
  const token = cookies.get("assemble_access_token");
  if (!token) return res.json({ error: true, reason: "Not authed" });
  console.log(req.body);
  const response = await fetch(
    "https://api.ticketing.assemble.hackclub.com/vaccinations/verified",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        qr: req.body.qr,
      }),
    }
  ).then((response) => response.text());
  console.log(response);
  res.send(response);
}
