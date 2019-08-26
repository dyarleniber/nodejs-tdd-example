class DashboardController {
  index(req, res) {
    return res.status(200).send();
  }
}

module.exports = new DashboardController();
