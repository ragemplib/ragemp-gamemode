export function makeEmailCode(length: number = 6): string {
  const characters = '0123456789'
  const charactersLength = characters.length
  let result = ''

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  console.log(result)

  return result
}
