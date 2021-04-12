export default (req, res) => {
  const code = req.query.code || "";

  const data = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
  const base64data = Buffer.from(data).toString("base64");

  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${base64data}`,
    },
    body: new URLSearchParams({
      code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  })
    .then((res) => {
      if (res.status !== 200) {
        return res.status(res.status).send(res.statusText);
      }
      return res.json();
    })
    .then((data) => res.status(200).json({ refresh_token: data.refresh_token }))
    .catch((err) => res.status(400).send("Error authenticating"));
};
