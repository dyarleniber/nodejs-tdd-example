const supertest = require("supertest");

const app = require("../../src/app");
const { User } = require("../../src/app/models");
const truncate = require("../utils/truncate");

const request = supertest(app);

describe("Authentication", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should be able to authenticate with valid credentials", async () => {
    const user = await User.create({
      name: "testauthenticate",
      email: "testauthenticate@test.com",
      password: "123123"
    });

    const response = await request.post("/sessions").send({
      email: user.email,
      password: user.password
    });

    expect(response.status).toBe(200);
  });

  it("should not be able to authenticate with invalid credentials", async () => {
    const user = await User.create({
      name: "testnotauthenticate",
      email: "testnotauthenticate@test.com",
      password: "123123"
    });

    const response = await request.post("/sessions").send({
      email: user.email,
      password: "123456"
    });

    expect(response.status).toBe(401);
  });

  it("should return a token when authenticated", async () => {
    const user = await User.create({
      name: "testtoken",
      email: "testtoken@test.com",
      password: "123123"
    });

    const response = await request.post("/sessions").send({
      email: user.email,
      password: user.password
    });

    expect(response.body).toHaveProperty("token");
  });

  it("should be able to access private routes when authenticated", async () => {
    const user = await User.create({
      name: "testprivateroute",
      email: "testprivateroute@test.com",
      password: "123123"
    });

    const response = await request
      .get("/dashboard")
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it("should not be able to access private routes without jwt token", async () => {
    const response = await request.get("/dashboard");

    expect(response.status).toBe(401);
  });

  it("should not be able to access private routes with invalid jwt token", async () => {
    const response = await request
      .get("/dashboard")
      .set("Authorization", `Bearer 123456`);

    expect(response.status).toBe(401);
  });
});
