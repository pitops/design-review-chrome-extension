let canvas
let ctx

const drawImage = dataURI => {
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx = canvas.getContext('2d')
  }

  const image = new Image()

  image.onload = () => {
    ctx.drawImage(image, 0, 0)
    download()
  }
  image.src = dataURI
}

const download = () => {
  const link = document.createElement('a')
  link.download = 'screenshot.png'
  link.href = canvas.toDataURL()
  link.click()
}

const getState = () => {
  const state = sessionStorage.getItem('state')

  return {
    type: 'get-state',
    payload: state ? JSON.parse(state) : { designMode: document.designMode }
  }
}

const saveState = payload => {
  sessionStorage.setItem('state', JSON.stringify(payload))
}

const toggleDesignMode = () => {
  document.designMode = document.designMode === 'off' ? 'on' : 'off'
  saveState({ designMode: document.designMode })

  return { type: 'toggle-designmode', payload: document.designMode }
}

const captureVisibleTab = () => {
  chrome.runtime.sendMessage({ type: 'captureVisibleTab' })
}

/** TRANSPORT LAYER */
const actions = {
  'toggle-designmode': toggleDesignMode,
  'get-state': getState,
  capture: captureVisibleTab,
  drawImage: drawImage
}

chrome.runtime.onMessage.addListener((request, sender, response) => {
  const reply = actions[request.type] && actions[request.type](request.payload)
  reply && response(reply)
})
/** END TRANSPORT LAYER */
