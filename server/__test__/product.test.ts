import supertest from "supertest";
import {app} from '../index'
describe("post", () => {
    describe("GET /post", () => {
        describe("given the product does not exist", () => {
            it("returns 404 if not found", async () => {
                const data = await supertest(app).get(`/api/post?limit=${10}&skip=${10}`).set('authorization',`JWT`)
                expect(data.status).toBe(200);
            })
        })
    })
})