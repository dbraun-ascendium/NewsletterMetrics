const mailchimp = require("./mailchimp")
const unslugify = require("../utils/unslugify")
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
let results = {
  send_time: "",
  open_rate: 0,
  clicks_per_unique_opens: 0,
  top_link_url: "",
  top_link_total_clicks: 0,
  top_link_unique_clicks: 0,
  top_link_percent_of_unique: 0,
  top_link_unslug: "",
  top_ext_link_url: "",
  top_ext_link_total_clicks: 0,
  top_ext_link_unique_clicks: 0,
  top_ext_link_percent_of_unique: 0,
  top_ext_link_domain: "",
}
async function report() {
  const response = await mailchimp.reports.getAllCampaignReports()
  const id = response.reports[0].id
  const latestReport = await mailchimp.reports.getCampaignReport(id, {
    fields: [
      "opens.open_rate",
      "opens.unique_opens",
      "clicks.unique_subscriber_clicks",
      "send_time"
    ],
  })
  const sendDate = new Date(latestReport.send_time)
  const sendMonth = months[sendDate.getMonth()]
  const sendYear = sendDate.getFullYear()
  results.send_time = `${sendMonth} ${sendYear}`
  results.open_rate = (latestReport.opens.open_rate * 100).toFixed(1)
  results.clicks_per_unique_opens = (
    (latestReport.clicks.unique_subscriber_clicks /
      latestReport.opens.unique_opens) *
    100
  ).toFixed(1)
  const clicksDetail = await mailchimp.reports.getCampaignClickDetails(id, {
    count: 1000,
    fields: [
      "urls_clicked.url",
      "urls_clicked.total_clicks",
      "urls_clicked.unique_clicks",
      "urls_clicked.unique_click_percentage",
    ],
  })
  
  clicksDetail.urls_clicked.sort((a, b) => b.total_clicks - a.total_clicks)

  results.top_link_url = clicksDetail.urls_clicked[0].url.split("?")[0]

  if (results.top_link_url.includes("ascendiumphilanthropy.org/shared-knowledge/news-and-insights/")) {
    results.top_link_unslug = unslugify(
      results.top_link_url.split("//")[1].split("/shared-knowledge/news-and-insights/")[1]
    )
  } else {
    results.top_link_unslug = unslugify(
      results.top_link_url.split("//")[1]
    )
  }

  results.top_link_total_clicks = clicksDetail.urls_clicked[0].total_clicks
  results.top_link_unique_clicks = clicksDetail.urls_clicked[0].unique_clicks
  results.unique_click_percentage = (clicksDetail.urls_clicked[0].unique_click_percentage*100).toFixed(1)

  const externalLinks = clicksDetail.urls_clicked.filter((item) => !item.url.includes("ascendiumphilanthropy.org"))

  results.top_ext_link_url = externalLinks[0].url.split("?")[0]
  results.top_ext_link_domain = results.top_ext_link_url.split("//")[1]

  results.top_ext_link_total_clicks = externalLinks[0].total_clicks
  results.top_ext_link_unique_clicks = externalLinks[0].unique_clicks
  results.top_ext_link_percent_of_unique = (externalLinks[0].unique_click_percentage*100).toFixed(1)

  return results
}
module.exports = report