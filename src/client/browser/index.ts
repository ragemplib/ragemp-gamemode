const browser: BrowserMp = mp.browsers.new('http://127.0.0.1:5173')
browser.active = false

mp.events.add('browserDomReady', async (readyBrowser: BrowserMp) => {
  if (readyBrowser == browser) {
    mp.events.call('uiReady')
    browser.active = true
  }
})

mp.events.add('notify', async (type: string, text: string, time: number = 3000) => {
  browser.call('notify', type, text, time)
})

mp.events.add('browser.call', async (eventName: string, ...args: any[]) => {
  browser.call(eventName, ...args)
})

mp.events.add('browser.setActive', async (state: boolean) => {
  browser.active = state
})
