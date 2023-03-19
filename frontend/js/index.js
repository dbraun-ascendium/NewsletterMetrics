import { handleFiles } from "./inputCSV"
import * as _ from "./parseCSV"

const process = function (data) {
  displayLoadedFiles(data.fileNames)
  _.countEndOfMonthTotal(data.subbed)
  _.countNewSubsLastMonth(data.subbed)
  _.getAnsweredSurvey(data.subbed)
  _.countRemovedLastMonth(data.unsubbed,data.cleaned)
  _.countSnapshotYearAgo(data)
}
const displayLoadedFiles = function (list) {
  const loadedFilesList = document.getElementById("loadedFiles")
  list.forEach((name) => {
    const li = document.createElement("li")
    li.appendChild(document.createTextNode(`${name}`))
    loadedFilesList.appendChild(li)
  })
}
const inputElement = document.getElementById("input")
inputElement.addEventListener("change", function () {
  document.querySelector("form").style.display = "none"
  const results = [...document.querySelectorAll(".results")]
  results.forEach(result => result.style.display = "block")
  handleFiles(this.files, process)
})

