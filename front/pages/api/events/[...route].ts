import makeServerCall from '@lib/makeServerCall';
import { VercelRequest, VercelResponse } from '@vercel/node'


export default async (request: VercelRequest, response: VercelResponse) => {
    const { method, queryParameters, bodyParameters } = JSON.parse(request.body);
    // auto populated by next
    const { route } = request.query;

    const apiURL = new URL(`http://localhost:8080/api/events/${Array.isArray(route) ? route.join("/") : route}`)
    apiURL.search = new URLSearchParams(queryParameters).toString(); 
    const res = await fetch(apiURL.toString(), {
        method: method,
        body: JSON.stringify(bodyParameters)
    })


  const data = await res.json();
  response.status(res.status).send(data);
}
