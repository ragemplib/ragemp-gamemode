export const browser = {
  call(eventName: string, ...args: any[]) {
    mp.events.call('browser.call', eventName, ...args)
  },

  setActive(state: boolean) {
    mp.events.call('browser.setActive', state)
  }
}
