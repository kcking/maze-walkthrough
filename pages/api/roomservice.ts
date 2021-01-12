import { NextApiRequest } from "next";

export default async function (req: NextApiRequest, res) {
  const user = req.cookies["roomservice-user"];
  if (!user) {
    throw "missing user cookie";
  }
  const body = req.body;
  const r = await fetch("https://super.roomservice.dev/provision", {
    method: "post",
    headers: {
      Authorization: `Bearer: ${process.env.ROOMSERVICE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: user,
      resources: body.resources,
    }),
  });
  return res.json(await r.json());
}
