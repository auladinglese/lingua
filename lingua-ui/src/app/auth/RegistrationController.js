import { OauthService } from './OauthService'
import { UserService } from './UserService'
import { ProfileService } from '../home/ProfileService'
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
      const newUser = await this.userService.createNew(this.user)
      const resp = await this.oauthService.getToken('lingua', 'secret', this.user.username, this.user.password)
      const token = resp.access_token
      if (token){
        this.securityContext.setToken(token)
        await this.profileService.createNew({userId: newUser.id})
        this.$state.go('dashboard')
      } else {
        this.userService.delete(newUser.id)
        this.messages.oops = 'Oops! Something went wrong. Please try again.'
      }
    } else {
      this.$scope.$apply()
    }
  }

}
