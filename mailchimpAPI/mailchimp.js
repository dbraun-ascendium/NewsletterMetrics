require("dotenv").config()
const mailchimp = require("@mailchimp/mailchimp_marketing")
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_KEY,
  server: "us12",
})
module.exports = mailchimp