const API_CODES: { [errorCode: string]: string } = {
  USER_WRONG_EMAIL_OR_PASSWORD: 'Email-ul sau parola sunt incorecte',
  USER_WRONG_PASSWORD: 'Parola actuală este incorectă',
}

export const GENERIC_ERROR_MESSAGE =
  'Ceva nu a funcționat. Vom remedia problema în cel mai scurt timp'

const getErrorMessage = (code: string) => {
  return API_CODES[code] || GENERIC_ERROR_MESSAGE
}

export default getErrorMessage
