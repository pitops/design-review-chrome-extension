chrome.runtime.onMessage.addListener((request, sender) => {
  chrome.tabs.captureVisibleTab(null, { format: 'png' }, dataURI => {
    replyBacktoContentScript('drawImage', dataURI)
  })
})

const replyBacktoContentScript = (type, payload) => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'drawImage', payload })
  })
}
