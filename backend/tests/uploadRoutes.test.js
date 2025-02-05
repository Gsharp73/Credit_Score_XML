const request = require("supertest");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const app = require("../server");

describe("Upload API Tests", () => {
  afterAll(async () => {
    await mongoose.connection.close(); 
  });

  test("Should return 400 if no file is uploaded", async () => {
    const res = await request(app).post("/upload").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("No file uploaded.");
  });

  test("Should return 200 and save report if valid XML file is uploaded", async () => {
    const filePath = path.join(__dirname, "../__mocks__/sample.xml");

    if (!fs.existsSync(filePath)) {
      throw new Error("Test XML file does not exist. Please add a sample XML file in __mocks__.");
    }

    const res = await request(app)
      .post("/upload")
      .attach("xmlFile", filePath);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/successfully/);
  }, 10000);
});
