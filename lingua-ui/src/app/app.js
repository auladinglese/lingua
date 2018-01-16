import angular from 'angular'
import { TaskController } from './tasks/TaskController'
import { TaskAllController } from './tasks/TaskAllController'
import { TaskService } from './tasks/TaskService'
import '@uirouter/angularjs'
// import domready from 'domready'

angular.module('app', ['ui.router'])
  .controller('TaskController', TaskController)
  .controller('TaskAllController', TaskAllController)
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
      controller: 'TaskController as task'
    })
    $stateProvider.state({
      name: 'edittask',
      url: '/edit-task/:id',
      templateUrl: '/app/tasks/newTask.html',
      controller: 'TaskController as task'
    })
    $stateProvider.state({
      name: 'alltasks',
      url: '/all-tasks',
      templateUrl: '/app/tasks/allTasks.html',
      controller: 'TaskAllController as tasks'
    })

    // $locationProvider.hashPrefix('')
    // $locationProvider.html5Mode(true)
    $urlRouterProvider.otherwise('/')

  }])

// domready(() => {
//     angular.bootstrap(document, ['app'])
// })
