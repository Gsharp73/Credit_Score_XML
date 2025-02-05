const request = require("supertest");
const app = require("../server");

describe("History API Tests", () => {
  test("Should return list of uploaded reports", async () => {
    const res = await request(app).get("/history");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
