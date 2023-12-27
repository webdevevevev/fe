export function isSignedIn() {
  return Boolean(localStorage.getItem('sign'))
}

export function isAdmin() {
  return parseSign(localStorage.getItem('sign')).admin
}

export function parseSign(sign: string): {
  id: number
  admin: boolean
} {
  const start = sign.indexOf('.') + 1
  const base64 = sign.substring(start, sign.indexOf('.', start))
  return JSON.parse(atob(base64))
}
