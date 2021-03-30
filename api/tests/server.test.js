const request = require('supertest')

const app = require('../express/app')

require('dotenv').config({ path: '.env.local' })

const PORT = 8083

let server;
let req;
beforeAll(async (done) => {
    server = app.default.listen(PORT, () => {
        req = request(server)
        done()
    });
});

afterAll((done) => {  
    server.close(done)
})

// end boilerplate

describe("Server", () => {
    test("It should fail authorization check", async () => {
      const response = await req.get("/api/users").set("Authorization", 'badkey');
      expect(response.statusCode).toBe(500);
      expect(response.text).toBe('Not authorized.');
    });
});
