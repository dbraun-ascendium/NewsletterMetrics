const unslugify = (slug) => {
  let result = slug
    .replace(/\-/g, " ")
    .replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    )
  if (result.charAt(result.length - 1) === "/") {
    result = result.slice(0, result.length - 1)
  }
  return result
}

module.exports = unslugify
