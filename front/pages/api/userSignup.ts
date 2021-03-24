import makeServerCall from '@lib/makeServerCall';
import { VercelRequest, VercelResponse } from '@vercel/node'

export default async (request: VercelRequest, response: VercelResponse) => {
  const user = request.body;

  const { bio, firstName, lastName, username } = user;

  if (firstName.length === 0 || lastName.length === 0) {
    return response.status(500).send(JSON.stringify({msg: "Must provide a first and last name."}))
  }

  if (bio.length > 500) {
    return response.status(500).send(JSON.stringify({msg: "Bio must be less than 500 characters."}))
  }

  if (!username || username.length < 3 || username.length > 15) {
    return response.status(500).send(JSON.stringify({msg: "Username must be between 3 and 15 characters."}))
  }


  const resp = await fetch("http://localhost:8080/api/users/signup", { 
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
      "Authorization": process.env.PROEVENTO_SECRET
    }
  });

  const data = await resp.json()
  response.status(resp.status).send(data)
}
