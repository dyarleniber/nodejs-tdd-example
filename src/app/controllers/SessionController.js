class SessionController {
  async store(req, res) {
    return res.json({
      message: "ok"
    });
  }
}

module.exports = new SessionController();
