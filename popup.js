let state

const toggleDesignMode = () => {
  broadcast({ type: 'toggle-designmode' })
}
const takeScreenshot = () => {
  broadcast({ type: 'capture' })
}

const broadcast = message => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      console.log(response)
      if (!response) return

      switch (response.type) {
        case 'toggle-designmode':
          document.getElementById('toggle-design-mode-btn').innerHTML =
            response.payload === 'on' ? 'Disable' : 'Enable'
          break
        case 'get-state':
          state = response.payload

          document.getElementById('toggle-design-mode-btn').innerHTML =
            state.designMode === 'on' ? 'Disable' : 'Enable'
          break
        default:
          break
      }
    })
  })
}

const init = () => {
  broadcast({ type: 'get-state' })
}

document.getElementById('toggle-design-mode-btn').onclick = toggleDesignMode
document.getElementById('take-screenshot-btn').onclick = takeScreenshot

window.onload = () => {
  init()
}
