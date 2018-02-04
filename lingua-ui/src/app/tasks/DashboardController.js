import { SecurityContext } from '../auth/SecurityContext'
import { UserService } from '../auth/UserService'


export class DashboardController {
  static $inject = ['SecurityContext', 'UserService', '$stateParams', '$state', '$window']


  constructor(securityContext, userService, $stateParams, $state, $window) {
    this.securityContext = securityContext
    this.userService = userService
    this.$stateParams = $stateParams
    this.$state = $state
    this.$window = $window

    this.userService.list('?role=student')
      .then(students => this.students = students)

  }

}
