import angular from 'angular'
import { DashboardController } from './DashboardController'
import { DashboardStudentController } from './DashboardStudentController'
import { ProfileService } from './ProfileService'
import { AppointmentService } from './AppointmentService'
import { datepicker } from './PikadayDirective'
import '@uirouter/angularjs'



angular.module('home', ['ui.router'])
  .controller('DashboardController', DashboardController)
  .controller('DashboardStudentController', DashboardStudentController)
  .service('ProfileService', ProfileService)
  .service('AppointmentService', AppointmentService)
  .directive('dsPikaday', datepicker)
  .config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state({
      name: 'dashboard',
      url: '/',
      templateUrl: '/app/home/html/dashboard.html',
      controller: 'DashboardController as dash'
    })
    $stateProvider.state({
      name: 'about',
      url: '/about-lingua',
      templateUrl: '/app/home/html/about.html',
    })
  }])
