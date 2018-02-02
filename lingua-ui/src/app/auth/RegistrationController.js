import { OauthService } from './OauthService'
import { UserService } from './UserService'
import { SecurityContext } from './SecurityContext'

export class RegistrationController {
  static $inject = ['OauthService', 'UserService', 'SecurityContext', '$state', '$scope']


  constructor(oauthService, userService, securityContext, $state, $scope) {
    this.oauthService = oauthService
    this.userService = userService
    this.securityContext = securityContext
    this.$state = $state
    this.$scope = $scope


  }


  passMatch(){
    if (this.user.password === this.confPassword){
      return true
    } else {
      this.messages.pass = 'Passwords do not match'
    }
  }

  async usernameFree(){
    const username = await this.userService.list('?username=' + this.user.login)
    if (username.length > 0) {
      this.messages.username = 'Sorry, that username is taken. Try another?'
      return false
    } else {
      return true
    }
  }

  async register(){
    this.messages = {}
    if (await this.usernameFree() && this.passMatch()){
      this.user.claims = [{
        name: 'role',
        value: this.user.role
      }]
      await this.userService.createNew(this.user)
      const resp = await this.oauthService.getToken('lingua', 'secret', this.user.login, this.user.password)
      this.securityContext.setToken(resp.access_token)
      this.$state.go('home')
    } else {
      this.$scope.$apply()
    }
  }


}
