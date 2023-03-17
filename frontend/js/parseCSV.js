const resultDisplay = document.querySelector(".results")

let endDateLastMonth = new Date()
endDateLastMonth.setDate(1)
endDateLastMonth.setHours(-1)
endDateLastMonth.setMinutes(59)
endDateLastMonth.setSeconds(59)

let startDateLastMonth = new Date()
const thisMonth = startDateLastMonth.getMonth()
startDateLastMonth.setMonth(thisMonth - 1)
startDateLastMonth.setDate(1)
startDateLastMonth.setHours(0)
startDateLastMonth.setMinutes(0)
startDateLastMonth.setSeconds(0)

let endDateLastMonthLastYear = new Date(endDateLastMonth)
endDateLastMonthLastYear.setFullYear(endDateLastMonth.getFullYear() - 1)

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

const countEndOfMonthTotal = function (list) {
  let count = 0
  list.forEach((subscriber) => {
    const confTime = new Date(subscriber.CONFIRM_TIME)
    if (confTime < endDateLastMonth) count++
  })
  const month = months[endDateLastMonth.getMonth()]
  const year = endDateLastMonth.getFullYear()
  resultDisplay.querySelector(
    ".results-current-total"
  ).textContent += `${month}, ${year}`
  resultDisplay.querySelector(
    ".results-current-total + .count"
  ).textContent = `${count}`
}

const countNewSubsLastMonth = function (list) {
  let count = 0
  list.forEach((subscriber) => {
    const confTime = new Date(subscriber.CONFIRM_TIME)
    if (confTime < endDateLastMonth && confTime > startDateLastMonth) count++
  })
  resultDisplay.querySelector(".results-new-total").textContent += `${
    months[startDateLastMonth.getMonth()]
  }`
  resultDisplay.querySelector(
    ".results-new-total + .count"
  ).textContent = `${count}`
}

const countCleanedLastMonth = function (list) {
  let count = 0
  list.forEach((cleaned) => {
    const cleanTime = new Date(cleaned.CLEAN_TIME)
    if (cleanTime < endDateLastMonth && cleanTime > startDateLastMonth) count++
  })
  resultDisplay.querySelector(".results-cleaned").textContent += `${
    months[endDateLastMonth.getMonth()]
  }`
  resultDisplay.querySelector(
    ".results-cleaned + .count"
  ).textContent = `${count}`
}
const countUnSubbedLastMonth = function (list) {
  let count = 0
  list.forEach((unsubbed) => {
    const unsubTime = new Date(unsubbed.UNSUB_TIME)
    if (unsubTime < endDateLastMonth && unsubTime > startDateLastMonth) count++
  })
  resultDisplay.querySelector(".results-unsubbed").textContent += `${
    months[endDateLastMonth.getMonth()]
  }`
  resultDisplay.querySelector(
    ".results-unsubbed + .count"
  ).textContent = `${count}`
}

const countSnapshotYearAgo = function (data) {
  let count = 0
  // # of subs at end of month prior year
  let countPriorYearCurrently = 0
  // # cleaned since a year ago but were subbed prior to that
  let cleanedLastYearSubbedBefore = 0
  // # unsubscribed since a year ago but were subbed prior to that
  let subbedLastYearSubbedBefore = 0
  data.subbed.forEach((subscriber) => {
    const confTime = new Date(subscriber.CONFIRM_TIME)
    if (confTime < endDateLastMonthLastYear) {
      countPriorYearCurrently++
    }
  })
  data.cleaned.forEach((cleaned) => {
    const confTime = new Date(cleaned.CONFIRM_TIME)
    const cleanTime = new Date(cleaned.CLEAN_TIME)
    if (
      cleanTime > endDateLastMonthLastYear &&
      confTime < endDateLastMonthLastYear
    ) {
      cleanedLastYearSubbedBefore++
    }
  })
  data.unsubbed.forEach((unsubbed) => {
    const confTime = new Date(unsubbed.CONFIRM_TIME)
    const unsubTime = new Date(unsubbed.UNSUB_TIME)
    if (
      unsubTime > endDateLastMonthLastYear &&
      confTime < endDateLastMonthLastYear
    ) {
      subbedLastYearSubbedBefore++
    }
  })
  count =
    countPriorYearCurrently +
    cleanedLastYearSubbedBefore +
    subbedLastYearSubbedBefore
  const year = endDateLastMonthLastYear.getFullYear()
  const month = months[endDateLastMonthLastYear.getMonth()]
  resultDisplay.querySelector(
    ".results-snapshot"
  ).textContent += `${month}, ${year}`
  resultDisplay.querySelector(
    ".results-snapshot + .count"
  ).textContent = `${count}`
}

export {countCleanedLastMonth, countEndOfMonthTotal, countNewSubsLastMonth, countSnapshotYearAgo, countUnSubbedLastMonth}