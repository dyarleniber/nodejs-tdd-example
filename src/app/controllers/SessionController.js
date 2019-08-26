const Mail = require("../services/MailService");
const { User } = require("../models");

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await Mail.send({
      from: "Noreply <noreply@noreply.com>",
      to: `${user.name} <${user.email}>`,
      subject: "New access",
      text: "Hello, we have identified a new access to your account."
    });

    return res.json({
      user,
      token: user.generateToken()
    });
  }
}

module.exports = new SessionController();
