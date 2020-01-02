
// birdnest.js

const doc = document
const frag = doc.createDocumentFragment()

const $container = doc.getElementById("hero")
const $footer = doc.getElementById("footer")

const LOG = console.info.bind(console)

const IS_DEV = false
const DEV_URL = '../app/json/db-test.json'
const PROD_URL = '../app/json/db.json'
const URL = IS_DEV ? DEV_URL : PROD_URL

const WORKER_PATH = '../app/js/work.js'

const CHUNK_COUNT = 500
const FPS = 1000 / 60

const OPEN_GPU_TURBO = Symbol.for('addStyleWillChange')
const CLOSE_GPU_TURBO = Symbol.for('removeStyleWillChange')

const CONFIG = {
  year: new Date().getFullYear(),
  author: " Chiang ",
  copyrightSign: "Copyright &copy; ",
  copyright: " All rights reserved ",
  email: ". jiangqizhi@aliyun.com"
}

const initFooter = () => {
  const {
    copyrightSign,
    year,
    author,
    copyright,
    email
  } = CONFIG
  $footer.innerHTML = `${copyrightSign}${year}${author}${copyright}${email}`
}

const createEle = (tagName, props) => {
  const dom = doc.createElement(tagName)
  Reflect.ownKeys(props).forEach((k) => {
    dom[k] = props[k]
  })
  return dom
}

const compose = (...fns) => {
  return fns.reduce((a, b) => (...args) => a(b(...args)))
}

const handleError = () => {
  frag.appendChild(createEle('div', {
    className: "row animated fadeInUp",
    innerHTML: `<div class="col-offset-2">Something is wrong here...</div>`
  }))
  $container.appendChild(frag)
  initFooter()
}

const frame = (list = []) => {
  const create = (dom) => createEle('div', {
    className: "row animated fadeInUp",
    innerHTML: dom.innerHTML
  })
  const append = (node) => frag.appendChild(node)
  const pack = compose(append, create)
  list.forEach(it => pack(it))
  const insert = () => $container.appendChild(frag)
  window.requestAnimationFrame(insert)
}

const gupTurbo = (action) => {
  switch (action) {
    case OPEN_GPU_TURBO:
      $container.style.willChange = 'contents, opacity, transform, scroll-position'
      break;
    case CLOSE_GPU_TURBO:
      $container.style.willChange = 'auto'
      break;
    default:
      break;
  }
}

const defer = (fn, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      typeof fn === 'function' ? fn() : null
      resolve()
    }, delay)
  })
}

const render = ({ list = [] }) => {
  const len = list.length
  if (len <= 0) return handleError()
  gupTurbo(OPEN_GPU_TURBO)
  if (len < CHUNK_COUNT) {
    frame(list)
    gupTurbo(CLOSE_GPU_TURBO)
    initFooter()
  } else {
    const slices = (p) => list.splice(0, parseInt(p * len, 10))
    Promise
      .all([
        defer(() => frame(slices(0.1))),
        defer(() => frame(slices(0.2)), FPS * 200),
        defer(() => frame(slices(0.3)), FPS * 500),
        defer(() => frame(list), FPS * 900)
      ])
      .then(() => {
        gupTurbo(CLOSE_GPU_TURBO)
        initFooter()
      })
  }
}

const init = ($ = {}) => {
  const worker = new Worker(WORKER_PATH)
  worker.postMessage($)
  worker.onmessage = (e) => {
    render(e.data)
    worker.terminate()
  }
  worker.onerror = () => {
    handleError()
    worker.terminate()
  }
}

const debounce = (fn, delay) => {
  let timer = null
  return function () {
    const self = this
    const args = arguments
    !!timer
      ? clearTimeout(timer)
      : timer = setTimeout(() => {
        timer = null
        fn.apply(self, args)
      }, delay)
  }
}

const loader = () => {
  if (!fetch) {
    handleError()
    throw new Error('Sorry. Your browser does not support fetch.')
  }
  fetch(URL)
    .then((resp) => {
      if ((resp.status >= 200 && resp.status < 300) || resp.status == 304) {
        return resp.json()
      }
    })
    .then((data) => {
      init(data)
    })
    .catch(() => {
      handleError()
    })
}

window.onload = () => {
  window.requestAnimationFrame(debounce(loader, 200))
}