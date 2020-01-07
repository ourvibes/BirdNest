this.addEventListener('message', (e) => {
  const T = (to = {}) => {
    let { name, url } = to
    if (name && url) {
      return `<div class="col-2 col-offset-2"><span class="icon-leaf"></span> <span>${name}</span></div><div class="col-4 col-offset-2"><a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></div>`
    }
  }

  const handleData = (data = {}) => {
    const { ip, list = [] } = data
    const format = (item) => {
      if (!item._key) {
        item._key = item.key.toLowerCase()
      }
      if (item.url && item.url.indexOf('{ip}') > -1) {
        item.url = item.url.replace(/{ip}/g, ip)
      }
      if (!item.innerHTML) {
        item.innerHTML = T(item)
      }
    }
    list
      .sort((x, y) => {
        format(x)
        format(y)
        if (x._key > y._key) {
          return 1
        } else if (x._key < y._key) {
          return -1
        } else {
          return 0
        }
      })
    return data
  }

  postMessage(handleData(e.data))
})
