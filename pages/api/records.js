import Cookies from "cookies";
import fetch from "node-fetch";

export default async function (req, res) {
  const cookies = new Cookies(req, res);
  const token = cookies.get("assemble_access_token");
  if (!token) return res.json({});
  const response = await fetch(
    `https://${process.env.NEXT_PUBLIC_TICKETING_DOMAIN}/users`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => response.json());
  res.json(response);
}
