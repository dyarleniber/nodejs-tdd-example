const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const truncate = require("../utils/truncate");
const factory = require("../factories");

describe("User", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should encrypt user password", async () => {
    const user = await factory.create("User");

    const compareHash = await bcrypt.compare(user.password, user.password_hash);

    expect(compareHash).toBe(true);
  });

  it("should generate a valid token", async () => {
    const user = await factory.create("User");

    const token = user.generateToken();

    const decoded = await promisify(jwt.verify)(token, process.env.APP_SECRET);

    expect(decoded.id).toBe(user.id);
  });
});
