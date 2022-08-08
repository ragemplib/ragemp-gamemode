import User from "../../database/entities/user";
import {userRepository} from "../../database/repositories";
import {makeEmailCode} from "../../utils/functions.util";
import {validateEmail, validatePassword} from "../../../shared/validators";

mp.events.add('server.auth.handleLoginData', handleLoginData)
mp.events.add('server.auth.handleRecoveryEmail', handleRecoveryEmail)
mp.events.add('server.auth.handleRecoveryData', handleRecoveryData)

interface ILoginData {
  login: string
  password: string
  savePassword: boolean
}

interface IRecoveryData {
  email: string
  code: string
  password: string
}

async function handleLoginData(player: PlayerMp, data: string) {
  try {
    const {login, password, savePassword}: ILoginData = await JSON.parse(data)

    const user: User = await userRepository.findOneBy({login})

    if (user && user.verifyPassword(password)) {
      player.spawn(new mp.Vector3(-425.517, 1123.620, 325.8544))
      player.model = mp.joaat('player_zero')
      player.databaseId = user.id

      player.call('client.auth.playerLogged', [login, password, savePassword])
      mp.events.call('server.auth.playerLogged', player)
    } else {
      player.call('client.auth.showBigError', ['Аккаунт не найден', 'Убедитесь, что вы не допустили ошибку'])
    }
  } catch (e) {
    console.error(e)
  }
}

async function handleRecoveryEmail(player: PlayerMp, email: string) {
  try {
    const candidate: User = await userRepository.findOneBy({email})
    if (candidate) {
      candidate.recoveryCode = makeEmailCode()
      candidate.recoveryCodeTimeEnd = (new Date().getTime() + 1800000).toString() // 30 minutes
      await userRepository.save(candidate)
      player.call('client.auth.setRecoveryConfirmStage', [email])
    } else {
      player.call('client.auth.showBigError', ['Аккаунт не найден', 'Убедитесь, что вы не допустили ошибку'])
    }
  } catch (e) {
    console.error(e)
  }
}

async function handleRecoveryData(player: PlayerMp, data: string) {
  try {
    const {email, code, password}: IRecoveryData = await JSON.parse(data)

    const candidate: User = await userRepository.findOneBy({email})

    if (candidate) {
      if (parseInt(candidate.recoveryCodeTimeEnd) - new Date().getTime() > 0 && candidate.recoveryCode == code) {
        if (validatePassword(password)) {
          candidate.setPassword(password)
          candidate.recoveryCode = null
          candidate.recoveryCodeTimeEnd = null
          await userRepository.save(candidate)
          player.call('client.auth.passwordRecovered')
        } else {
          player.call('client.auth.showBigError', ['Ошибка', 'Пароль может содержать только буквы латинского алфавита и символы - _ . @'])
        }
      } else {
        player.call('client.auth.showBigError', ['Неверный код', 'Убедитесь, что вы не допустили ошибку'])
      }
    } else {
      player.call('client.auth.showBigError', ['Аккаунт не найден', 'Убедитесь, что вы не допустили ошибку'])
    }
  } catch (e) {
    console.error(e)
  }
}
