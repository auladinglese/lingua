import { OauthService } from './OauthService'
import { SecurityContext } from './SecurityContext'

export class LoginController {
  static $inject = ['OauthService', 'SecurityContext', '$state']

  constructor(oauthService, securityContext, $state) {
    this.oauthService = oauthService
    this.securityContext = securityContext
    this.$state = $state

  }

  login() {
    this.message = ''
    this.oauthService.getToken('lingua', 'secret', this.username, this.password)
      .then(resp => {
        if (!resp.access_token){
          this.message = 'Invalid username or password'
        } else {
          this.securityContext.setToken(resp.access_token)
          this.$state.go('dashboard')
        }
      })
  }

  logout(){
    this.securityContext.removeToken()
    this.$state.go('login')
  }
}
