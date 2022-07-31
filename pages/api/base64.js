export default function base64(req, res) {
  if (!req.method == "POSST") return res.send("Invaid mathod");
  const cookies = new Cookies(req, res);
  const token = cookies.get("assemble_access_token");
  fetch(
    `https://${process.env.NEXT_PUBLIC_TICKETING_DOMAIN}/vaccinations/image/base64`,
    {
      method: "POST",
      body: JSON.stringify({
        mimeType: req.body.file.type,
        data: req.body.base64,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).then((response) => response.text().then(res.send));
}
