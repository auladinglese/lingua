import angular from 'angular'
import { TaskController } from './tasks/TaskController'
import { TaskNewController } from './tasks/TaskNewController'
import { TaskService } from './tasks/TaskService'
import '@uirouter/angularjs'
import 'angular-sanitize'
// import domready from 'domready'

angular.module('app', ['ui.router', 'ngSanitize'])
  .controller('TaskController', TaskController)
  .controller('TaskNewController', TaskNewController)
  .service('TaskService', TaskService)
  .config(['$stateProvider', '$urlRouterProvider', /*'$locationProvider',*/ ($stateProvider, $urlRouterProvider /*, $locationProvider*/) => {

    $stateProvider.state({
      name: 'home',
      url: '/',
    })
    $stateProvider.state({
      name: 'newtask',
      url: '/new-task',
      templateUrl: '/app/tasks/newTask.html',
      controller: 'TaskNewController as task'
    })
    $stateProvider.state({
      name: 'alltasks',
      url: '/all-tasks',
      templateUrl: '/app/tasks/allTasks.html',
      controller: 'TaskController as tasks'
    })

    // $locationProvider.hashPrefix('')
    // $locationProvider.html5Mode(true)
    $urlRouterProvider.otherwise('/')

  }])

// domready(() => {
//     angular.bootstrap(document, ['app'])
// })
