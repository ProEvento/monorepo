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

    test("It should get a specific users profile by ID", async () => {
        const response = await req.get(`/api/users/1`).set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toMatchObject({
            "id": 1,
            "firstName": "Maxwell",
            "lastName": "Leiter",
            "email": "mleiter@usc.edu",
            "username": "maxattack",
            "github": "",
            "linked": null,
            "twitter": null,
            "bio": "",
            "picture": null
          })
    });

    test("It should get a specific users profile by username", async () => {
        const response = await req.get(`/api/users/getByUsername?username=maxattack`).set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toMatchObject({
            "id": 1,
            "firstName": "Maxwell",
            "lastName": "Leiter",
            "email": "mleiter@usc.edu",
            "username": "maxattack",
            "github": "",
            "linked": null,
            "twitter": null,
            "bio": "",
            "picture": null
        })
    });

    test("It should get topics a user is following", async () => {
        const response = await req.get(`/api/users/topics/1`).set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toMatchObject({
            id: 1,
            title: 'pokemon',
            User_id: 1,
            createdAt: '2021-03-21T08:32:17.000Z',
            updatedAt: '2021-03-21T08:32:17.000Z',
            deletedAt: null
        })
    });


    test("It should get users a user is following", async () => {
        const response = await req.get(`/api/users/following/1`).set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test("It should get users following a user", async () => {
        const response = await req.get(`/api/users/followers/1`).set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });


});


