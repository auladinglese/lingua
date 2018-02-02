import { SecurityContext } from './SecurityContext'

export class TokenValidatingHttpInterceptor {

  constructor(securityContext, $state) {
    this.securityContext = securityContext
    this.$state = $state

  }

  request = (config) => {
    if (config.url.indexOf('/token') > -1) {
      return config
    }

    const token = this.securityContext.getToken()
    if (!token) {
      return config
    }

    return {
      ...config,
      headers: {
        ...config.headers,
        'Authorization': 'Bearer ' + token
      }
    }
  }

  responseError = (rejection) => {
    if (rejection.status === 401) {
      this.$state.go('login')
    }

    return rejection
  }
}
