export const validateSymbols = (text: string) => text.match(/^[\w\_\-\.\@]+$/i)

export const validateLength = (text: string, min: number, max: number) => (text.length > min && text.length <= max)
