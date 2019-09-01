const supertest = require("supertest");
const nodemailer = require("nodemailer");

const app = require("../../src/app");
const truncate = require("../utils/truncate");
const factory = require("../factories");

const request = supertest(app);

jest.mock("nodemailer");

const transport = {
  sendMail: jest.fn()
};

describe("Authentication", () => {
  beforeEach(async () => {
    await truncate();
  });

  beforeAll(() => {
    nodemailer.createTransport.mockReturnValue(transport);
  });

  it("should be able to authenticate with valid credentials", async () => {
    const user = await factory.create("User");

    const response = await request.post("/sessions").send({
      email: user.email,
      password: user.password
    });

    expect(response.status).toBe(200);
  });

  it("should not be able to authenticate with invalid user", async () => {
    const user = await factory.build("User");

    const response = await request.post("/sessions").send({
      email: user.email,
      password: user.password
    });

    expect(response.status).toBe(401);
  });

  it("should not be able to authenticate with invalid password", async () => {
    const user = await factory.create("User", {
      password: "123123"
    });

    const response = await request.post("/sessions").send({
      email: user.email,
      password: "123456"
    });

    expect(response.status).toBe(401);
  });

  it("should return a token when authenticated", async () => {
    const user = await factory.create("User");

    const response = await request.post("/sessions").send({
      email: user.email,
      password: user.password
    });

    expect(response.body).toHaveProperty("token");
  });

  it("should be able to access private routes when authenticated", async () => {
    const user = await factory.create("User");

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

  it("should receive email notification when authenticated", async () => {
    const user = await factory.create("User");

    await request.post("/sessions").send({
      email: user.email,
      password: user.password
    });

    expect(transport.sendMail).toHaveBeenCalledTimes(1);
    expect(transport.sendMail.mock.calls[0][0].to).toBe(
      `${user.name} <${user.email}>`
    );
  });
});
