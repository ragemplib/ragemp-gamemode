import {browser} from "../../utils/browser.util";

const player: PlayerMp = mp.players.local

mp.events.add('client.auth.showBigError', showBigError)
mp.events.add('playerReady', onPlayerReady)
mp.events.add('uiReady', onUiReady)

function showBigError(title: string, errorText: string) {
  browser.call('cef.auth.setBigError', title, errorText)
}

function onPlayerReady() {
  mp.game.streaming.switchOutPlayer(player.handle, 0, 1)
  mp.gui.chat.show(false)
  mp.game.ui.displayRadar(false)
  mp.game.ui.display(false)
}

function onUiReady() {
  const routeOptions = { name: 'auth-login', params: { savedPassword: '', savedLogin: '', savePassword: false } }
  const savePassword = mp.storage.data.savePassword

  if (savePassword) {
    routeOptions.params.savedPassword = mp.storage.data.savedPassword
    routeOptions.params.savedLogin = mp.storage.data.savedLogin
  }
  routeOptions.params.savePassword = savePassword

  browser.call('pushRoute', routeOptions)
  mp.gui.cursor.visible = true
}
