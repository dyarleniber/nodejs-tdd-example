module.exports = {
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  port: process.env.MAIL_PORT | 2525,
  host: process.env.MAIL_HOST
};
