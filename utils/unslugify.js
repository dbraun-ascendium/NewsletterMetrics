const unslugify = (slug) =>
slug
  .replace(/\-/g, " ")
  .replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  )

  module.exports = unslugify