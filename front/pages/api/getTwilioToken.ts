import { VercelRequest, VercelResponse } from '@vercel/node'

export default async (request: VercelRequest, response: VercelResponse) => {
  const { username, room } = request.query;
  const res = await fetch(`http://localhost:8080/api/token?username=${username}&room=${room}`, {
    method: "GET"
  })
  const data = await res.text();
  console.log(data)
  response.status(res.status).json({token: data});
}