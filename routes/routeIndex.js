const express = require("express")
const router = express.Router()
const report = require("../mailchimpAPI/report")

router.get("/", async (req, res) => {
  const results = await report()
  res.render("index", { 
    title: "Newsletter Metrics",
    clicks_per_unique_opens: results.clicks_per_unique_opens,
    open_rate: `${results.open_rate}%`,
    top_link_unslug: results.top_link_unslug,
    top_link_url: results.top_link_url,
    top_link_total_clicks: results.top_link_total_clicks,
    top_link_unique_clicks: results.top_link_unique_clicks,
    unique_click_percentage: `${results.unique_click_percentage}%`,
    top_ext_link_url: results.top_ext_link_url,
    top_ext_link_domain: results.top_ext_link_domain,
    top_ext_link_total_clicks: results.top_ext_link_total_clicks,
    top_ext_link_unique_clicks: results.top_ext_link_unique_clicks,
    top_ext_link_percent_of_unique: `${results.top_ext_link_percent_of_unique}%`
  })
})

module.exports = router
