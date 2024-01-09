const express = require("express");
const request = require("supertest");
const bookRoute = require("../routes/book.routes");
const { save } = require("../services/save.services")


const app = express();
app.use(express.json());
app.use("/api/books", bookRoute);

jest.mock("../data/books.json", () => [
    { "name": "Call of the wild", "author": "Louis wilder", "id": 1 },
    { "name": "Love like no other", "author": "Charlie Bronsey", "id": 2 },
    { "name": "Face Off", "author": "Jamie Phillips", "id": 3 }
])

describe("Integration tests for books API", () => {

    // beforeAll(() => {
    //     const initData = [{ "name": "Call of the wild", "author": "Louis wilder", "id": 1 },
    //     { "name": "Love like no other", "author": "Charlie Bronsey", "id": 2 },
    //     { "name": "Face Off", "author": "Jamie Phillips", "id": 3 }]

    //     save(initData)
    // })


    it("GET - /api/books - success - get all the books", async () => {
        const { body, statusCode } = await request(app).get("/api/books");

        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    author: expect.any(String)
                })
            ])
        )

        expect(statusCode).toBe(200);

    })

    it('POST  /api/books - faliure on invalid post body', async () => {
        const { body, statusCode } = await request(app).post('/api/books').send({
            name: '',
            author: 'John Travolta'
        });

        expect(statusCode).toBe(400);
        expect(body).toEqual({
            errors: [
                {
                    "type": "field",
                    "value": "",
                    "msg": "Book name is required",
                    "path": "name",
                    "location": "body"
                }
            ]
        });
    });


    it('POST /api/books - success', async () => {
        const { body, statusCode } = await request(app).post("/api/books").send({
            name: "Face Off",
            author: "John Travolta"
        })

        expect(statusCode).toBe(200);
        expect(body).toEqual({
            message: 'Success'
        })
    })

    it("PUT /api/books/:bookid - failure when book is not found", async () => {
        const { body, statusCode } = await request(app).put("/api/books/5000").send({
            name: "Love me like you do",
            author: "John Trovalta"
        })

        expect(statusCode).toBe(404);

        expect(body).toEqual({
            error: true,
            message: "Book not found"
        })
    })

    it("PUT /api/books/:bookid - Success - Successfully update book", async () => {
        const { body, statusCode } = await request(app).put("/api/books/2").send({
            name: "Hello World",
            author: "Jack White"
        })

        expect(statusCode).toBe(201);

        expect(body).toEqual({
            name: "Hello World",
            author: "Jack White",
            id: 2
        })
    })

    it("Delete /api/delete/:bookid  - failure when book is not found", async () => {
        const { body, statusCode } = await request(app).delete("/api/books/5000")

        expect(statusCode).toBe(404);
        expect(body).toEqual({
            "errors": true,
            "message": "Book not found"
        })
    })

    it("Delete /api/books/:bookid Success - Successfully delete ", async () => {
        const { body, statusCode } = await request(app).delete("/api/books/3");
        expect(statusCode).toBe(201)
        expect(body).toEqual({
            message: "Success"
        })
    })


})

// PASS  tests/bookrouter.integration.test.js
// Integration tests for books API
//   √ GET - /api/books - success - get all the books (43 ms)
//   √ POST  /api/books - faliure on invalid post body (27 ms)
//   √ POST /api/books - success (10 ms)
//   √ PUT /api/books/:bookid - failure when book is not found (35 ms)
//   √ PUT /api/books/:bookid - Success - Successfully update book (18 ms)
//   √ Delete /api/delete/:bookid  - failure when book is not found (10 ms)
//   √ Delete /api/books/:bookid Success - Successfully delete  (11 ms)

// Test Suites: 1 passed, 1 total
// Tests:       7 passed, 7 total
// Snapshots:   0 total
// Time:        1.536 s, estimated 2 s