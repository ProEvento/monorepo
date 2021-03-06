import { VercelRequest, VercelResponse } from '@vercel/node'

export default async (request: VercelRequest, response: VercelResponse) => {
  const { username, room } = request.query;
  const res = await fetch(`http://localhost:8080/api/twilio/token?username=${username}&room=${room}`, {
    method: "GET",
    headers: {
      "Authorization": process.env.PROEVENTO_SECRET
    }
  })
  const data = await res.text();
  response.status(res.status).json({token: data});
}