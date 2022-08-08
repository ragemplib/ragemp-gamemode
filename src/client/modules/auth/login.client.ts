import {protectSpam} from "../../utils/antispam.util";
import {browser} from "../../utils/browser.util";

const player: PlayerMp = mp.players.local

mp.events.add('client.auth.transferLoginData', transferLoginData)
mp.events.add('client.auth.transferRecoveryEmail', transferRecoveryEmail)
mp.events.add('client.auth.transferRecoveryData', transferRecoveryData)

mp.events.add('client.auth.setRecoveryConfirmStage', setRecoveryConfirmStage)
mp.events.add('client.auth.playerLogged', onPlayerLogged)
mp.events.add('client.auth.passwordRecovered', onPasswordRecovered)

function transferLoginData(data: string) {
  protectSpam('auth.login', () => {
    mp.events.callRemote('server.auth.handleLoginData', data)
  })
}

function transferRecoveryEmail(email: string) {
  protectSpam('auth.recovery', () => {
    mp.events.callRemote('server.auth.handleRecoveryEmail', email)
  })
}

function transferRecoveryData(data: string) {
  protectSpam('auth.recovery', () => {
    mp.events.callRemote('server.auth.handleRecoveryData', data)
  })
}


function onPlayerLogged(login: string, password: string, savePassword: boolean) {
  mp.storage.data.savePassword = savePassword
  if (savePassword) {
    mp.storage.data.savedLogin = login
    mp.storage.data.savedPassword = password
  } else {
    mp.storage.data.savedLogin = ''
    mp.storage.data.savedPassword = ''
  }
  mp.storage.flush()

  browser.call('pushRoute', {name: 'hud'})
  browser.setActive(false)
  mp.gui.cursor.visible = false
  mp.game.streaming.switchInPlayer(player.handle)
  setTimeout(() => {
    mp.gui.chat.show(true)
    mp.game.ui.displayRadar(true)
    mp.game.ui.display(true)
  }, 4000)
}

function setRecoveryConfirmStage(email: string) {
  browser.call('cef.auth.setRecoveryConfirmStage', email)
}

function onPasswordRecovered() {
  browser.call('cef.auth.setRecoveryFinalStage')
}
