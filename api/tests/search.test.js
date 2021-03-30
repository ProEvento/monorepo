const request = require('supertest')

const app = require('../express/app')
require('dotenv').config({ path: '.env.local' })

const PORT = 8084


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

describe("Search", () => {
    test("User doesn't exist", async () => {
        const response = await req.get("/api/search/user?query=aispjfipajgdngaljngdjljgnaljnegdfl").set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(200);
        expect(response.body.results).toBeInstanceOf(Array);
        expect(response.body.results.length).toBe(0);
      });
    test("Event doesn't exist", async () => {
        const response = await req.get("/api/search/event?query=aispjfipajgdngaljngdjljgnaljnegdfl").set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(200);
        expect(response.body.results).toBeInstanceOf(Array);
        expect(response.body.results.length).toBe(0);
      });
    test("Search for user by email", async () => {
      const response = await req.get("/api/search/user?query=mleiter@usc.edu").set("Authorization", process.env.PROEVENTO_SECRET);
      expect(response.statusCode).toBe(200);
      expect(response.body.results).toBeInstanceOf(Array);
      expect(response.body.results.length).toBeGreaterThan(0);
      expect(response.body.results).toMatchObject([{
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
      }])
    });
    test("Search for user by username", async () => {
        const response = await req.get("/api/search/user?query=maxattack").set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(200);
        expect(response.body.results).toBeInstanceOf(Array);
        expect(response.body.results.length).toBeGreaterThan(0);
        expect(response.body.results).toMatchObject([{
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
          }])
    });
    test("Search for user by name", async () => {
        const response = await req.get("/api/search/user?query=leiter").set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(200);
        expect(response.body.results).toBeInstanceOf(Array);
        expect(response.body.results.length).toBeGreaterThan(0);
        let length = response.body.results.length;
        for (let i = 0; i < length; i++) {
            let firstName = response.body.results[i].firstName.toLowerCase();
            let lastName = response.body.results[i].lastName.toLowerCase();
            let username = response.body.results[i].username.toLowerCase();
            if (firstName != "leiter" && lastName != "leiter" && username != "leiter") {
                expect({"same": 1}).toMatchObject({"not the same": 2});
            }
        }
        expect({"same": 1}).toMatchObject({"same": 1});
    });
    test("Search for event by title or description", async () => {
        const response = await req.get("/api/search/event?query=test").set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(200);
        expect(response.body.results).toBeInstanceOf(Array);
        expect(response.body.results.length).toBeGreaterThan(0);
        let length = response.body.results.length;
        for (let i = 0; i < length; i++) {
            let title = response.body.results[i].title.toLowerCase();
            let description = response.body.results[i].description.toLowerCase();
            if (!(title.includes("test")) && !(description.includes("test"))) {
                expect({"same": 1}).toMatchObject({"not the same": 2});
            }
        }
        expect({"same": 1}).toMatchObject({"same": 1});
      });    
    test("Search for event by date", async () => {
        let end = new Date(2021, 3, 23)
        let start = new Date(2020, 12, 25)
        const response = await req.get("/api/search/event_date?start=" + start.toISOString() + "&end=" + end.toISOString()).set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(200);
        expect(response.body.results).toBeInstanceOf(Array);
        expect(response.body.results.length).toBeGreaterThan(0);
        let length = response.body.results.length;
        for (let i = 0; i < length; i++) {
            let time = response.body.results[i].time;
            let dateObject = new Date(time);
            expect(dateObject.getTime()).toBeLessThanOrEqual(end.getTime());
            expect(dateObject.getTime()).toBeGreaterThanOrEqual(start.getTime());
        }
      });
});