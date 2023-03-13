const express = require("express")
const indexRouter = require("./routes/routeIndex.js")

const app = express()
app.set("views", "views")
app.set("view engine", "ejs")

// in case we want to try receiving data from
// query strings or json
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"))
app.use("/", indexRouter)

app.listen(3000, () => {
  console.log("express us running")
})
