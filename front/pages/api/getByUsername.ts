import { VercelRequest, VercelResponse } from '@vercel/node'

export default async (request: VercelRequest, response: VercelResponse) => {
  const { username } = request.query;
  const res = await fetch(`http://localhost:8080/api/users/getByUsername?username=${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  const data = await res.json();
  response.status(res.status).send(JSON.stringify(data));
}