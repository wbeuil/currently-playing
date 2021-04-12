export default (req, res) => {
  const refresh_token = req.query.refresh_token || "";

  const data = `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`;
  const base64data = Buffer.from(data).toString("base64");

  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${base64data}`,
    },
    body: new URLSearchParams({
      refresh_token,
      grant_type: "refresh_token",
    }),
  })
    .then((res) => {
      if (res.status !== 200) {
        return res.status(res.status).send(res.statusText);
      }
      return res.json();
    })
    .then((data) => res.status(200).json({ token: data.access_token }))
    .catch((err) => res.status(400).send("Error requesting new token"));
};
