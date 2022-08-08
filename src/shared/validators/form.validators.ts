import {validateLength, validateSymbols} from "./index";

export const validateEmail = (text: string) => text.match(/^[\w\-\_\.]+\@[\w\-\_\.]+\.[\w\-]{2,4}$/i) && validateLength(text, 4, 254)

export const validateLogin = (text: string) => validateSymbols(text) && validateLength(text, 4, 32)

export const validatePassword = (text: string) => validateSymbols(text) && validateLength(text, 8, 32)
