import { VercelRequest, VercelResponse } from '@vercel/node'

export default async (request: VercelRequest, response: VercelResponse) => {
  const { id } = request.query;
  const res = await fetch(`http://localhost:8080/api/events/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })

  const data = await res.json();
  response.status(res.status).send(data);
}
