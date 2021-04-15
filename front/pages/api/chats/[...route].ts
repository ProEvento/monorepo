import makeServerCall from '@lib/makeServerCall';
import { VercelRequest, VercelResponse } from '@vercel/node'


export default async (request: VercelRequest, response: VercelResponse) => {
    const { method, queryParameters, bodyParameters } = JSON.parse(request.body);
    // auto populated by next
    const { route } = request.query;
    const apiURL = new URL(`http://localhost:8080/api/chats/${Array.isArray(route) ? route.join("/") : route}`)
    apiURL.search = new URLSearchParams(queryParameters).toString(); 
    const res = await fetch(apiURL.toString(), {
        method: method,
        headers: {
          "Authorization": process.env.PROEVENTO_SECRET
        },
        body: JSON.stringify(bodyParameters)
    })

    //console.log(res.body)

  const data = await res.json();
  response.status(res.status).json(data);
}
