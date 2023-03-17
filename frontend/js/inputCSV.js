import Papa from "papaparse"

let audienceData = {
  cleaned: null,
  unsubbed: null,
  subbed: null,
  fileNames: []
}
const csvToObject = (file) =>
  new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      error: onError,
      complete: (parsed) => {
        if (file.name.indexOf("unsubscribed") >= 0) {
          audienceData.unsubbed = parsed.data
          audienceData.fileNames.push(file.name)
        } else if (file.name.indexOf("cleaned") >= 0) {
          audienceData.cleaned = parsed.data
          audienceData.fileNames.push(file.name)
        } else {
          audienceData.subbed = parsed.data
          audienceData.fileNames.push(file.name)
        }
        resolve("success")
      },
    })
  })

const handleFiles = function (files, process) {
  if (files.length !== 3) {
    alert("must be 3 files")
    return
  }
  // const files = this.files
  Promise.all([
    csvToObject(files[0]),
    csvToObject(files[1]),
    csvToObject(files[2]),
  ])
    .then(() => {
      process(audienceData)
    })
    .catch((err) => {
      console.log("error: ", err)
    })
}

const onError = function (err, file) {
  console.log("error: " + err)
  console.log("file: " + file.name)
}

export { handleFiles }