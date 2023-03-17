import { handleFiles } from "./inputCSV"
import * as _ from "./parseCSV"

const process = function (data) {
  displayLoadedFiles(data.fileNames)
  _.countEndOfMonthTotal(data.subbed)
  _.countNewSubsLastMonth(data.subbed)
  _.countCleanedLastMonth(data.cleaned)
  _.countUnSubbedLastMonth(data.unsubbed)
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
  document.querySelector(".results").style.display = "block"
  handleFiles(this.files, process)
})

