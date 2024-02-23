const API_CODES: { [errorCode: string]: string } = {
  USER_WRONG_EMAIL_OR_PASSWORD: 'Email-ul sau parola sunt incorecte',
  USER_WRONG_PASSWORD: 'Parola actuala este incorecta',
}

export const GENERIC_ERROR_MESSAGE =
  'Ceva nu a functionat. Vom remedia problema in cel mai scurt timp'

const getErrorMessage = (code: string) => {
  return API_CODES[code] || GENERIC_ERROR_MESSAGE
}

export default getErrorMessage
