
this.addEventListener('message', (e) => {
  const T = (to = {}) => {
    let { name, url } = to
    if (name && url) {
      return `<div class="col-2 col-offset-2"><span class="icon-leaf"></span>&ensp;<span>${name}</span></div><div class="col-4 col-offset-2"><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></div>`
    }
  }

  const handleData = (data = {}) => {
    const { ip, list = [] } = data
    list
      .sort((x, y) => {
        x = x.key.toLowerCase()
        y = y.key.toLowerCase()
        if (x > y) {
          return 1
        } else if (x < y) {
          return -1
        } else {
          return 0
        }
      })
      .map((it) => {
        it.url = it.url && it.url.replace(/{ip}/g, ip)
        it.innerHTML = T(it)
      })
    return data
  }

  postMessage(handleData(e.data))
})



