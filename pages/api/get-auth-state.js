import Cookies from "cookies";

export default async function (req, res) {
  const cookies = new Cookies(req, res);
  const token = cookies.get("assemble_access_token");
  const altToken = cookies.get("hackclub-ticketing-auth");
  if (token && altToken) return res.send("TRUE");
  else return res.send("FALSE");
}
