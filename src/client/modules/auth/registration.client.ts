import {protectSpam} from "../../utils/antispam.util";
import {browser} from "../../utils/browser.util";

const player: PlayerMp = mp.players.local

mp.events.add('client.auth.transferRegistrationData', transferRegistrationData)
mp.events.add('client.auth.transferRegistrationConfirmData', transferRegistrationConfirmData)
mp.events.add('client.auth.transferRegistrationPromoData', transferRegistrationPromoData)
mp.events.add('client.auth.transferRegistrationReferralData', transferRegistrationReferralData)

mp.events.add('client.auth.setRegistrationConfirmStage', setRegistrationConfirmStage)
mp.events.add('client.auth.setRegistrationError', setRegistrationError)
mp.events.add('client.auth.playerCreated', onPlayerCreated)
mp.events.add('client.auth.promoChanged', onPromoChanged)
mp.events.add('client.auth.referralChanged', onReferralChanged)

function transferRegistrationData(data: string) {
  protectSpam('auth.registration', () => {
    mp.events.callRemote('server.auth.handleRegistrationData', data)
  })
}

function transferRegistrationConfirmData(data: string) {
  protectSpam('auth.registration', () => {
    mp.events.callRemote('server.auth.handleRegistrationConfirmData', data)
  })
}

function transferRegistrationPromoData(data: string) {
  protectSpam('auth.registration.promo', () => {
    mp.events.callRemote('server.auth.handleRegistrationPromoData', data)
  })
}

function transferRegistrationReferralData(data: string) {
  protectSpam('auth.registration.referral', () => {
    mp.events.callRemote('server.auth.handleRegistrationReferralData', data)
  })
}

function setRegistrationConfirmStage() {
  browser.call('cef.auth.setRegistrationConfirmStage')
}

function setRegistrationError(key: string, text: string) {
  browser.call('cef.auth.setRegistrationError', key, text)
}

function onPlayerCreated() {
  browser.call('cef.auth.showPromo')
}


function onPromoChanged() {
  browser.call('cef.auth.showReferralPromo')
}

function onReferralChanged() {
  browser.call('pushRoute', {name: 'hud'})
  browser.setActive(false)
  mp.gui.cursor.visible = false
  mp.game.streaming.switchInPlayer(player.handle)
  setTimeout(() => {
    mp.gui.chat.show(true)
    mp.game.ui.displayRadar(true)
    mp.game.ui.display(true)
  }, 5000)

  mp.events.remove('client.auth.playerCreated', onPlayerCreated)
  mp.events.remove('client.auth.promoChanged', onPromoChanged)
  mp.events.remove('client.auth.referralChanged', onReferralChanged)
}
