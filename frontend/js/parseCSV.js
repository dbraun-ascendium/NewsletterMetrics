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
const month = months[endDateLastMonth.getMonth()]
const year = endDateLastMonth.getFullYear()
const lastYear = endDateLastMonthLastYear.getFullYear()

const countEndOfMonthTotal = function (list) {
  let count = 0
  list.forEach((subscriber) => {
    const confTime = new Date(subscriber.CONFIRM_TIME)
    if (confTime < endDateLastMonth) count++
  })

  resultDisplay.querySelector(
    ".results-current-total"
  ).textContent += `${month}, ${year}`
  resultDisplay.querySelector(
    ".results-current-total + .count"
  ).textContent = `${count}`
}
const getNewSubsLastMonth = function (list) {
  let newSubs = []
  list.forEach((subscriber) => {
    const confTime = new Date(subscriber.CONFIRM_TIME)
    if (confTime < endDateLastMonth && confTime > startDateLastMonth)
      newSubs.push(subscriber)
  })
  return newSubs
}
const countNewSubsLastMonth = function (list) {
  const count = getNewSubsLastMonth(list).length
  resultDisplay.querySelector(".results-new-total").textContent += `${month}`
  resultDisplay.querySelector(
    ".results-new-total + .count"
  ).textContent = `${count}`
}

const getAnsweredSurvey = function (list) {
  let countAnswered = 0
  let answers = []

  const newSubs = getNewSubsLastMonth(list)
  newSubs.forEach((subscriber) => {
    if (subscriber["How did you hear about us?"] != "") {
      countAnswered++
      answers.push(subscriber["How did you hear about us?"])
    }
  })
  const uniqueAnswers = [...new Set(answers)]
  let answersObjs = []

  uniqueAnswers.forEach((answer) => {
    const count = answers.filter((x) => x === answer).length
    answersObjs.push({
      answer,
      count,
      percent: ((count / answers.length) * 100).toFixed(1),
    })
  })
  answersObjs.sort((a, b) => b.count - a.count)

  console.dir(answersObjs)
  displayHearAboutUs(countAnswered, newSubs.length)
}
const displayHearAboutUs = function (countAnswered, totalSubs) {
  const hearAboutUs = document.querySelector(".hear-about-us")
  const percentAnswered = (countAnswered / totalSubs).toFixed(2) * 100
  hearAboutUs.textContent = `In the month of ${month}, 2023, ${countAnswered} of ${totalSubs} new subscribers answered the “How You Found Us” questionnaire (${percentAnswered}%).`
}
const countCleanedLastMonth = function (list) {
  let count = 0
  list.forEach((cleaned) => {
    const cleanTime = new Date(cleaned.CLEAN_TIME)
    if (cleanTime < endDateLastMonth && cleanTime > startDateLastMonth) count++
  })
  resultDisplay.querySelector(".results-cleaned").textContent += `${month}`
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
  resultDisplay.querySelector(".results-unsubbed").textContent += `${month}`
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
  resultDisplay.querySelector(
    ".results-snapshot"
  ).textContent += `${month}, ${lastYear}`
  resultDisplay.querySelector(
    ".results-snapshot + .count"
  ).textContent = `${count}`
}

export {
  countCleanedLastMonth,
  countEndOfMonthTotal,
  countNewSubsLastMonth,
  countSnapshotYearAgo,
  countUnSubbedLastMonth,
  getAnsweredSurvey,
}
