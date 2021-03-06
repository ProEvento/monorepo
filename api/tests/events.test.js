const request = require('supertest')

const app = require('../express/app')

require('dotenv').config({ path: '.env.local' })

const PORT = 8082

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

// here be dragons
let id = undefined
describe("Events", () => {
    test("It should get a specific event by ID", async () => {
        const response = await req.get(`/api/events/1`).set("Authorization", process.env.PROEVENTO_SECRET);
        const expected = {
            title: "title",
            description : "fun fun fun fun fun time to zoom zoom zoom zoom join us :)",
            priv : true,
            picture : "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/close-up-of-tulips-blooming-in-field-royalty-free-image-1584131616.jpg?crop=1.00xw:0.798xh;0,0.202xh&resize=980:*",
            time: "2020-03-26T18:10:10.000Z",
            User_id: '3',
        }
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body).toMatchObject(expected);
    });

    test("It should 404 getting an event with a non-existent ID", async () => {
        const response = await req.get(`/api/events/0`).set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(404);
        expect(response.body).toBeInstanceOf(Object);
    });

    test("It should create an Event", async () => {
      const toSend = {
          title: "testTitle",
          description : "testDescription",
          priv : true,
          picture : "imgur.com",
          time: (new Date()).toISOString(),
          userId: 1,
          User_id: '1',
        }

        const results = Object.assign({}, toSend)
        delete results['userId']
        const queryURL = new URLSearchParams(toSend).toString()
        const response = await req.post(`/api/events/createEventByUser?${queryURL}`).send(toSend).set("Authorization", process.env.PROEVENTO_SECRET).set('Content-Type', 'application/json').set('Accept', 'application/json');
        expect(response.statusCode).toBe(201);
        expect(response.body.event).toMatchObject(results);
        id = response.body.event.id
    });

    test("It should add an existing topic to an Event", async () => {
        const addTopic = {
            id : id,
            searchTitle : "pokemon"
        }
        const queryURL = new URLSearchParams(addTopic).toString()
        const response = await req.post(`/api/events/setTopic?${queryURL}`).set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(200);
    });

    test("It should 500 adding a non-existent topic to an Event", async () => {
        const addTopic = {
            id : id,
            searchTitle : "digimon"
        }
        const queryURL = new URLSearchParams(addTopic).toString()
        const response = await req.post(`/api/events/setTopic?${queryURL}`).set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(500);
    });

    test("It should 404 adding a topic to a non-existent Event", async () => {
        const addTopic = {
            id : 0,
            searchTitle : "pokemon"
        }
        const queryURL = new URLSearchParams(addTopic).toString()
        const response = await req.post(`/api/events/setTopic?${queryURL}`).set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(404);
    });

    test("It should start an Event", async () => {
        const response = await req.put("/api/events/startEvent?id=" + id).set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(200);
        expect(response.body.started).toBe(true);
    });

    test("It should add a User as attending an Event", async () => {
        const user = {
            userId : 4,
        }
        const queryURL = new URLSearchParams(user).toString()
        const response = await req.post(`/api/events/joinEvent/` + id + `?${queryURL}`).set("Authorization", process.env.PROEVENTO_SECRET);
        const attending = await req.get(`/api/events/getAttending/4`).set("Authorization", process.env.PROEVENTO_SECRET);
        let flag = false;
        let length = attending.body.length;
        for (let i = 0; i < length; i++) {
            if (attending.body[i]['id'] == id) {
                expect(attending.body[i]['id']).toBe(id);
                flag = true;
            }
        }
        if(!flag){
            expect(1).toBe(0);
        }
        expect(response.statusCode).toBe(200);
    });

    test("It should remove a User as attending an Event", async () => {
        const user = {
            userId : 4,
        }
        const queryURL = new URLSearchParams(user).toString()
        const response = await req.post(`/api/events/leaveEvent/` + id + `?${queryURL}`).set("Authorization", process.env.PROEVENTO_SECRET);
        const attending = await req.get(`/api/events/getAttending/4`).set("Authorization", process.env.PROEVENTO_SECRET);
        let length = attending.body.length;
        for (let i = 0; i < length; i++) {
            if (attending.body[i]['id'] == id) {
                expect(1).toBe(0);
            }
        }
        expect(response.statusCode).toBe(200);
    });

    test("It should end an Event", async () => {
        const response = await req.put("/api/events/endEvent?id=" + id).set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(200);
        expect(response.body.ended).toBe(true);
    });

    test("It should delete an Event", async () => {
      const response = await req.delete("/api/events/" + id).set("Authorization", process.env.PROEVENTO_SECRET);
      expect(response.statusCode).toBe(200);
      const ev = await req.get(`/api/events/` + id).set("Authorization", process.env.PROEVENTO_SECRET);
      expect(ev.statusCode).toBe(404);
    });

    test("It should 400 starting an Event before start date", async () => {
        const response = await req.put("/api/events/startEvent?id=47").set("Authorization", process.env.PROEVENTO_SECRET);
        expect(response.statusCode).toBe(400);
        expect(response.body.msg).toBe("Cannot start event before start time")
    });

    test("It should 500 if title is missing from event creation data", async () => {
        const toSend = {
            description : "testDescription",
            priv : true,
            picture : "imgur.com",
            time: (new Date()).toISOString(),
            userId: 1,
            User_id: '1',
          }
          const queryURL = new URLSearchParams(toSend).toString()
          const response = await req.post(`/api/events/createEventByUser?${queryURL}`).send(toSend).set("Authorization", process.env.PROEVENTO_SECRET).set('Content-Type', 'application/json').set('Accept', 'application/json');
          expect(response.statusCode).toBe(500);
    });

    test("It should 400 if host user does not exist", async () => {
        const toSend = {
            title: "testTitle",
            description : "testDescription",
            priv : true,
            picture : "imgur.com",
            time: (new Date()).toISOString(),
            userId: 0,
            User_id: '1',
          }
          const queryURL = new URLSearchParams(toSend).toString()
          const response = await req.post(`/api/events/createEventByUser?${queryURL}`).send(toSend).set("Authorization", process.env.PROEVENTO_SECRET).set('Content-Type', 'application/json').set('Accept', 'application/json');
          expect(response.statusCode).toBe(400);
          expect(response.body.msg).toBe("User not found")
    });

    test("It should 400 if id query param is used", async () => {
        const toSend = {
            title: "testTitle",
            description : "testDescription",
            priv : true,
            picture : "imgur.com",
            time: (new Date()).toISOString(),
            userId: 1,
            User_id: '1',
            id: 100,
          }
          const queryURL = new URLSearchParams(toSend).toString()
          const response = await req.post(`/api/events/createEventByUser?${queryURL}`).send(toSend).set("Authorization", process.env.PROEVENTO_SECRET).set('Content-Type', 'application/json').set('Accept', 'application/json');
          expect(response.statusCode).toBe(400);
          expect(response.body.msg).toBe("Bad request: ID should not be provided, since it is determined automatically by the database.")
    });

});


