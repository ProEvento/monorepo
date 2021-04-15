import { VercelRequest, VercelResponse } from '@vercel/node'


export default async (request: VercelRequest, response: VercelResponse) => {
    const { method, queryParameters, bodyParameters } = JSON.parse(request.body);
    const apiURL = new URL(`http://localhost:8080/api/groups`)
    apiURL.search = new URLSearchParams(queryParameters).toString(); 
    console.log(apiURL)
    const res = await fetch(apiURL.toString(), {
        method: method,
        body: JSON.stringify(bodyParameters),
        headers: {
          "Authorization": process.env.PROEVENTO_SECRET
        }
    })


  const data = await res.json();
  response.status(res.status).send(data);
}