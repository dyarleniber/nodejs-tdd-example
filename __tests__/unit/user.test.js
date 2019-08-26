const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const { User } = require("../../src/app/models");
const truncate = require("../utils/truncate");

describe("User", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should encrypt user password", async () => {
    const user = await User.create({
      name: "test",
      email: "test@test.com",
      password: "123123"
    });

    const compareHash = await bcrypt.compare(user.password, user.password_hash);

    expect(compareHash).toBe(true);
  });

  it("should generate a valid token", async () => {
    const user = await User.create({
      name: "test",
      email: "test@test.com",
      password: "123123"
    });

    const token = user.generateToken();

    const decoded = await promisify(jwt.verify)(token, process.env.APP_SECRET);

    expect(decoded.id).toBe(user.id);
  });
});
