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
const lastDay = endDateLastMonth.getDate()
const year = endDateLastMonth.getFullYear()
const lastYear = endDateLastMonthLastYear.getFullYear()
const lastDayLastYear = endDateLastMonthLastYear.getDate()

const countEndOfMonthTotal = function (list) {
  let count = 0
  list.forEach((subscriber) => {
    const confTime = new Date(subscriber.CONFIRM_TIME)
    if (confTime < endDateLastMonth) count++
  })

  resultDisplay.querySelector(
    ".results-current-total"
  ).innerHTML = `Subscribers as of ${month}, ${lastDay} ${year}: <strong>${count}</strong>`
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
  resultDisplay.querySelector(".results-new-total").innerHTML += `${month}: <strong>${count}</strong>`
}

const getAnsweredSurvey = function (list) {
  let countAnswered = 0
  let answers = []
  let otherAnswers = []

  const newSubs = getNewSubsLastMonth(list)
  newSubs.forEach((subscriber) => {
    if (subscriber["How did you hear about us?"] != "") {
      countAnswered++
      answers.push(subscriber["How did you hear about us?"])
    }
    if (subscriber["How did you hear about us? (not listed above)"] != "") {
      otherAnswers.push(subscriber["How did you hear about us? (not listed above)"])
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

  displayHearAboutUs(countAnswered, newSubs.length, answersObjs, otherAnswers)
}
const displayHearAboutUs = function (countAnswered, totalSubs, answersObjs, otherAnswers) {
  const hearAboutUs = document.querySelector(".hear-about-us")
  const percentAnswered = (countAnswered / totalSubs).toFixed(2) * 100
  hearAboutUs.innerHTML = `In the month of ${month}, ${year}, <strong>${countAnswered}</strong> of <strong>${totalSubs}</strong> new subscribers answered the “How You Found Us” questionnaire (<strong>${percentAnswered}%</strong>).`
  let table = document.querySelector('.results-bottom table');
  const th = table.createTHead()
  const tRow = th.insertRow()
  tRow.insertCell().textContent = "Answer"
  tRow.insertCell().textContent = "Count"
  tRow.insertCell().textContent = "Percent"
  const tBody = table.createTBody()
  answersObjs.forEach((answer => {
    const newRow = tBody.insertRow();
    newRow.insertCell().textContent = answer.answer
    newRow.insertCell().textContent = answer.count
    newRow.insertCell().textContent = `${answer.percent}%`
  }))
  const otherReasonsUL = document.querySelector('.results-bottom ul')
  const uniqueOtherAnswers = [...new Set(otherAnswers)]
  uniqueOtherAnswers.forEach((otherAnswer) => {
    const li = document.createElement('li')
    li.textContent = otherAnswer
    otherReasonsUL.appendChild(li)
  })
}
const countRemovedLastMonth = function (unsubbedList, cleanedList) {
  let unsubbedCount = 0
  let cleanedCount = 0
  cleanedList.forEach((cleaned) => {
    const cleanTime = new Date(cleaned.CLEAN_TIME)
    if (cleanTime < endDateLastMonth && cleanTime > startDateLastMonth) cleanedCount++
  })
  unsubbedList.forEach((unsubbed) => {
    const unsubTime = new Date(unsubbed.UNSUB_TIME)
    if (unsubTime < endDateLastMonth && unsubTime > startDateLastMonth) unsubbedCount++
  })
  displayRemovedResults(unsubbedCount, cleanedCount)
}

const displayRemovedResults = function(unsubbedCount, cleanedCount) {
  const resultsRemoved = document.querySelector('.results-removed')
  resultsRemoved.textContent = `Total users removed in ${month}, ${year}`
  resultDisplay.querySelector(
    ".results-cleaned"
  ).innerHTML += ` ${month}: <strong>${cleanedCount}</strong>`
  resultDisplay.querySelector(
    ".results-unsubbed"
  ).innerHTML += ` ${month}: <strong>${unsubbedCount}</strong>`
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
  ).innerHTML += `HISTORICAL SNAPSHOT: Total Subscribers on ${month}, ${lastDayLastYear} ${lastYear}: <strong>${count}</strong>`
}

export {
  countEndOfMonthTotal,
  countNewSubsLastMonth,
  countSnapshotYearAgo,
  countRemovedLastMonth,
  getAnsweredSurvey,
}
