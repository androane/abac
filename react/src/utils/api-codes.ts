const API_CODES: { [errorCode: string]: string } = {
  USER_WRONG_EMAIL_OR_PASSWORD: 'Email-ul sau parola sunt incorecte',
  USER_WRONG_PASSWORD: 'Parola actuala este incorecta',
}

const getErrorMessage = (code: string) => {
  return API_CODES[code] || 'Ceva nu a functionat. Vom remedia problema in cel mai scurt timp'
}

export default getErrorMessage
