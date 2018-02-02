export class SecurityContext {
  setToken(token) {
    window.localStorage.setItem('token', token)
  }

  getToken() {
    return window.localStorage.getItem('token')
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  getUser() {
    const token = this.getToken()
    if (token == null) {
      return null
    }

    const payload = atob(token.split('.')[1])
    return JSON.parse(payload)
  }
}
