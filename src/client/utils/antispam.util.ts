import {browser} from "./browser.util";

const groups: string[] = []

export function protectSpam(group: string, callback: CallableFunction, delay: number = 3000) {
  if (groups.indexOf(group) == -1) {
    callback()
    groups.push(group)
    setTimeout(() => { delete groups[groups.indexOf(group)] }, delay)
    return
  }
  browser.call('notify', 'warning', 'Слишком быстро')
}
