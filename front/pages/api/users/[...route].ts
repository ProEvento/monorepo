import { VercelRequest, VercelResponse } from '@vercel/node'
import getByUsername from '../getByUsername';


export default async (request: VercelRequest, response: VercelResponse) => {
    const { method, queryParameters, bodyParameters } = JSON.parse(request.body);

    // auto populated by next
    const { route } = request.query;

    const apiURL = new URL(`http://localhost:8080/api/users/${route}`)
    apiURL.search = new URLSearchParams(queryParameters).toString(); 
    console.log(apiURL.toString())
    const res = await fetch(apiURL.toString(), {
        method: method,
        body: JSON.stringify(bodyParameters)
    })

    
  const data = await res.json();
  response.status(res.status).send(data);
}
