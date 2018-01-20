import angular from 'angular'
import { TemplateController } from './tasks/TemplateController'
import { TemplateListController } from './tasks/TemplateListController'
import { AssignmentController } from './tasks/AssignmentController'
import { CompleteTaskController } from './tasks/CompleteTaskController'
import { MarkTaskController } from './tasks/MarkTaskController'
import { TaskService } from './tasks/TaskService'
import '@uirouter/angularjs'

angular.module('app', ['ui.router'])
  .controller('TemplateController', TemplateController)
  .controller('TemplateListController', TemplateListController)
  .controller('AssignmentController', AssignmentController)
  .controller('CompleteTaskController', CompleteTaskController)
  .controller('MarkTaskController', MarkTaskController)
  .service('TaskService', TaskService)
  .config(['$stateProvider', '$urlRouterProvider', /*'$locationProvider',*/ ($stateProvider, $urlRouterProvider /*, $locationProvider*/) => {

    $stateProvider.state({
      name: 'home',
      url: '/',
    })
    $stateProvider.state({
      name: 'newTemplate',
      url: '/new-template',
      templateUrl: '/app/tasks/html/newTemplate.html',
      controller: 'TemplateController as task'
    })
    $stateProvider.state({
      name: 'editTemplate',
      url: '/edit-template/:id',
      templateUrl: '/app/tasks/html/newTemplate.html',
      controller: 'TemplateController as task'
    })
    $stateProvider.state({
      name: 'asssignTask',
      url: '/task-assignment/:id?level&category&subject&name',
      params: {
        id: {value: null},
        level: {dynamic: true},
        category: {dynamic: true},
        subject: {dynamic: true},
        name: {dynamic: true}
      },
      templateUrl: '/app/tasks/html/assignTask.html',
      controller: 'AssignmentController as assign'
    })
    $stateProvider.state({
      name: 'templates',
      url: '/templates?level&category&subject&name',
      params: {
        level: {dynamic: true},
        category: {dynamic: true},
        subject: {dynamic: true},
        name: {dynamic: true}
      },
      templateUrl: '/app/tasks/html/templates.html',
      controller: 'TemplateListController as tasks'
    })
    $stateProvider.state({
      name: 'completeTask',
      url: '/my-tasks/:id',
      params: { id: {value: null} },
      templateUrl: '/app/tasks/html/completeTask.html',
      controller: 'CompleteTaskController as complete'
    })
    $stateProvider.state({
      name: 'markTask',
      url: '/masrk-tasks',
      templateUrl: '/app/tasks/html/markTask.html',
      controller: 'MarkTaskController as mark'
    })


    // $locationProvider.hashPrefix('')
    // $locationProvider.html5Mode(true)
    $urlRouterProvider.otherwise('/')

  }])
