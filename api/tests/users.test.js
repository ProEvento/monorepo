const request = require('supertest')

const app = require('../express/app')

require('dotenv').config({ path: '.env.local' })

const PORT = 8081

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

describe("Users", () => {
    test("It should get all Users", async () => {
      const response = await req.get("/api/users").set("Authorization", process.env.PROEVENTO_SECRET);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });

    test("It should get a specific user's profile by ID", async () => {
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

    test("It should 404 getting a non-existant specific user's profile by ID", async () => {
        const response = await req.get(`/api/users/0`).set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe("404 - Not found")
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

    test("It should 500 getting a user if no username is provided to getByUsername", async () => {
        const response = await req.get(`/api/users/getByUsername`).set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(500);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toMatchObject({ msg: "Username in query required"})
    });


    test("It should 404 getting a user if a non-existant username is provided to getByUsername", async () => {
        const response = await req.get(`/api/users/getByUsername?username=${Math.random().toString(18).substring(7)}`).set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(404);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toMatchObject({ msg: "User not found."})
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
