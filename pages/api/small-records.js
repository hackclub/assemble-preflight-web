import Cookies from "cookies";
import fetch from "node-fetch";

export default async function (req, res) {
  const cookies = new Cookies(req, res);
  const token = cookies.get("assemble_access_token");
  if (!token) return res.json({ error: true, reauth: true });
  const response = await fetch(
    `https://${process.env.NEXT_PUBLIC_TICKETING_DOMAIN}/users/small`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => response.json());
  if (response.reason == "AccessToken not authenticated.")
    response.reauth = true;
  if (response.reason == "malformed JWT") response.reauth = true;
  res.json(response);
}
