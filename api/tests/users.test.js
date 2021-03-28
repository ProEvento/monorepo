const request = require('supertest')

const app = require('../express/app')
require('dotenv').config({ path: '.env.local' })

const PORT = 8080


let server;
let req;
beforeAll(async () => {
    server = app.default.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    req = request(server)
});

afterAll(async (done) => {
    server.close(done)
})

// end boilerplate

describe("Users", () => {
    test("It should get all Users", async () => {
      const response = await req.get("/api/users").set("Authorization", process.env.PROEVENTO_SECRET);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
});


