import { OauthService } from './OauthService'
import { UserService } from './UserService'
import { ProfileService } from '../tasks/ProfileService'
import { SecurityContext } from './SecurityContext'

export class RegistrationController {
  static $inject = ['OauthService', 'UserService', 'ProfileService', 'SecurityContext', '$state', '$scope']


  constructor(oauthService, userService, profileService, securityContext, $state, $scope) {
    this.oauthService = oauthService
    this.userService = userService
    this.profileService = profileService
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
    const username = await this.userService.list('?username=' + this.user.username)
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
      const resp = await this.oauthService.getToken('lingua', 'secret', this.user.username, this.user.password)
      this.securityContext.setToken(resp.access_token)
      await this.profileService.createNew({userId: this.securityContext.getUser().userId})
      this.$state.go('dashboard')
    } else {
      this.$scope.$apply()
    }
  }


}
