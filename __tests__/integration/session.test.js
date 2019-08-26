const request = require("supertest");

const app = require("../../src/app");
const { User } = require("../../src/app/models");

describe("Authentication", () => {
  it("should be able to authenticate with valid credentials", async () => {
    const user = await User.create({
      name: "test",
      email: "test@test.com",
      password: "123123"
    });

    const response = await request(app)
      .post("/sessions")
      .send({
        email: user.email,
        password: user.password
      });

    expect(response.status).toBe(200);
  });
});
