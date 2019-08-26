const supertest = require("supertest");
const app = require("../../src/app");
const request = supertest(app);

const truncate = require("../utils/truncate");
const { User } = require("../../src/app/models");

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
});
