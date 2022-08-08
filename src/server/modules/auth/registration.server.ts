import User from "../../database/entities/user";
import {userRepository} from "../../database/repositories";
import {makeEmailCode} from "../../utils/functions.util";
import {validateEmail, validateLogin, validatePassword} from "../../../shared/validators";

mp.events.add('server.auth.handleRegistrationData', handleRegistrationData)
mp.events.add('server.auth.handleRegistrationConfirmData', handleRegistrationConfirmData)
mp.events.add('server.auth.handleRegistrationPromoData', handleRegistrationPromoData)
mp.events.add('server.auth.handleRegistrationReferralData', handleRegistrationReferralData)

mp.events.add('playerQuit', removeFromCachedData)
mp.events.add('server.auth.playerLogged', removeFromCachedData)

interface IRegistrationData {
  login: string
  password: string
  email: string
  acceptPolicy: false
}

interface IConfirmData {
  email: string
  code: string
}

interface IPromoData {
  login: string,
  password: string,
  promo: string
}

interface IReferralData {
  login: string,
  password: string,
  referralLink: string
}

const cachedRegistrationData: { [playerId: string]: IRegistrationData } = {}
const activeEmailCodes: { [playerId: string]: {email: string, code: string} } = {}

async function handleRegistrationData(player: PlayerMp, data: string) {
  try {
    const parsedData: IRegistrationData = await JSON.parse(data)

    let isDataValid = true
    if (!parsedData.acceptPolicy) {
      player.call('client.auth.setRegistrationError', ['acceptPolicy', 'Вы должны согласиться с правилами сервера, чтобы начать играть'])
      isDataValid = false
    }

    if (!validateEmail(parsedData.email)) {
      player.call('client.auth.setRegistrationError', ['email', 'Некорректный E-mail'])
      isDataValid = false
    }

    if (!validateLogin(parsedData.login)) {
      player.call('client.auth.setRegistrationError', ['login', 'Некорректный логин'])
      isDataValid = false
    }

    if (!validatePassword(parsedData.password)) {
      player.call('client.auth.setRegistrationError', ['password', 'Некорректный пароль'])
      isDataValid = false
    }

    // If data valid and login or email occupied, we highlight form fields for user, else we cache registration data.
    if (isDataValid) {
      const candidate: User = await userRepository.findOneBy([{login: parsedData.login}, {email: parsedData.email}])

      if (candidate) {
        if (candidate.email == parsedData.email) {
          player.call('client.auth.setRegistrationError', ['email', 'Данная почта уже занята'])
        }
        if (candidate.login == parsedData.login) {
          player.call('client.auth.setRegistrationError', ['login', 'Данный логин уже занят'])
        }
      } else {
        cachedRegistrationData[String(player.id)] = parsedData

        const code = makeEmailCode()
        activeEmailCodes[String(player.id)] = {email: parsedData.email, code}

        player.call('client.auth.setRegistrationConfirmStage')
      }
    }
  } catch (e) {
    console.error(e)
  }
}

async function handleRegistrationConfirmData(player: PlayerMp, data: string) {
  try {
    const {email, code}: IConfirmData = await JSON.parse(data)

    const isRightCode: boolean = ((): boolean => {
      const _email = activeEmailCodes[String(player.id)].email
      const _code = activeEmailCodes[String(player.id)].code
      return _email == email && _code == code
    })()
    const cachedData: IRegistrationData = cachedRegistrationData[player.id]

    if (isRightCode) {
      if (cachedData) {
        const user: User = new User()
        user.login = cachedData.login
        user.email = cachedData.email
        user.acceptPolicy = cachedData.acceptPolicy
        user.setPassword(cachedData.password)
        await userRepository.save(user)

        delete activeEmailCodes[String(player.id)]
        await removeFromCachedData(player)

        player.call('client.auth.playerCreated')
        mp.events.call('server.auth.playerCreated', player)
      } else {
        player.call('client.auth.showBigError', ['ОШИБКА СЕРВЕРА', 'Извините, что-то пошло не так.'])
      }
    } else {
      player.call('client.auth.showBigError', ['Неверный код', 'Убедитесь, что вы не допустили ошибку'])
    }

  } catch (e) {
    console.error(e)
  }
}

async function handleRegistrationPromoData(player: PlayerMp, data: string) {
  try {
    const {login, password, promo}: IPromoData = await JSON.parse(data)

    const candidate: User = await userRepository.findOneBy({login})
    if (candidate && candidate.verifyPassword(password)) {
      candidate.promo = promo
      await userRepository.save(candidate)

      player.call('client.auth.promoChanged')
      mp.events.call('server.auth.promoChanged', player)
    }

  } catch (e) {
    console.log(e)
  }
}

async function handleRegistrationReferralData(player: PlayerMp, data: string) {
  try {
    const {login, password, referralLink}: IReferralData = await JSON.parse(data)

    const candidate: User = await userRepository.findOneBy({ login })
    if (candidate && candidate.verifyPassword(password)) {
      candidate.referralLink = referralLink
      await userRepository.save(candidate)

      player.call('client.auth.referralChanged')
      mp.events.call('server.auth.referralChanged', player)
    }

  } catch (e) {
    console.log(e)
  }
}

async function removeFromCachedData(player: PlayerMp) {
  if (Object.keys(cachedRegistrationData).indexOf(String(player.id)) !== -1) {
    delete cachedRegistrationData[String(player.id)]
  }
}
