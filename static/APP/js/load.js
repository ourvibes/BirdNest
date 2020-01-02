for (const src of [
  "../app/js/birdnest.js"
]) {
  const script = document.body.appendChild(document.createElement("script"))
  script.async = false
  script.src = src
}