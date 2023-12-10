export function isSignedIn() {
  return Boolean(localStorage.getItem('sign'))
}

export function parseSign(sign: string): { id: number } {
  const start = sign.indexOf('.') + 1
  const base64 = sign.substring(start, sign.indexOf('.', start))
  return JSON.parse(atob(base64))
}
