import 'babel-polyfill'
import angular from 'angular'
import { TemplateController } from './tasks/TemplateController'
import { TemplateListController } from './tasks/TemplateListController'
import { AssignmentController } from './tasks/AssignmentController'
import { CompleteLessonController } from './tasks/CompleteLessonController'
import { EvaluateLessonController } from './tasks/EvaluateLessonController'
import { DashboardController } from './tasks/DashboardController'
import { TaskService } from './tasks/TaskService'
import { LessonService } from './tasks/LessonService'
import './auth/AuthModule'
import '@uirouter/angularjs'

angular.module('app', ['ui.router', 'auth'])
  .controller('TemplateController', TemplateController)
  .controller('TemplateListController', TemplateListController)
  .controller('AssignmentController', AssignmentController)
  .controller('CompleteLessonController', CompleteLessonController)
  .controller('EvaluateLessonController', EvaluateLessonController)
  .controller('DashboardController', DashboardController)
  .service('TaskService', TaskService)
  .service('LessonService', LessonService)
  .config(['$stateProvider', '$urlRouterProvider', /*'$locationProvider',*/ ($stateProvider, $urlRouterProvider /*, $locationProvider*/) => {

    $stateProvider.state({
      name: 'dashboard',
      url: '/',
      templateUrl: '/app/tasks/html/dashboard.html',
      controller: 'DashboardController as dash'
    })
    $stateProvider.state({
      name: 'about',
      url: '/about-lingua',
      templateUrl: '/app/tasks/html/about.html',

    })
    $stateProvider.state({
      name: 'newTemplate',
      url: '/new-template',
      templateUrl: '/app/tasks/html/newTemplate.html',
      controller: 'TemplateController as ctrl'
    })
    $stateProvider.state({
      name: 'editTemplate',
      url: '/edit-template/:templateId',
      templateUrl: '/app/tasks/html/newTemplate.html',
      controller: 'TemplateController as ctrl'
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
      controller: 'TemplateListController as templates'
    })
    $stateProvider.state({
      name: 'assignLesson',
      url: '/assignment/studentID::studentId&:lessonId&:taskId&:new?level&category&subject&name',
      params: {
        studentId: {value: null},
        lessonId: {value: null},
        new: {value: null},
        taskId: {dynamic: true, value: null},
        level: {dynamic: true},
        category: {dynamic: true},
        subject: {dynamic: true},
        name: {dynamic: true}
      },
      templateUrl: '/app/tasks/html/assignLesson.html',
      controller: 'AssignmentController as assign'
    })
    $stateProvider.state({
      name: 'addTask',
      url: '/add-task/studentID::studentId&:lessonId&:templateId?level&category&subject&name',
      params: {
        lessonId: {value: null},
        studentId: {value: null},
        templateId: {value: null},
        level: {dynamic: true},
        category: {dynamic: true},
        subject: {dynamic: true},
        name: {dynamic: true}
      },
      templateUrl: '/app/tasks/html/addTask.html',
      controller: 'AssignmentController as assign'
    })
    $stateProvider.state({
      name: 'completeLesson',
      url: '/my-lessons/lesson:lessonId&:taskId',
      params: {
        lessonId: {value: null},
        taskId: {dynamic: true, value: null}
      },
      templateUrl: '/app/tasks/html/completeLesson.html',
      controller: 'CompleteLessonController as complete'
    })
    // $stateProvider.state({
    //   name: 'evaluateLesson',
    //   url: '/evaluate-lessons/lesson:lessonId/:taskId',
    //   params: {
    //     lessonId: {value: null},
    //     taskId: {dynamic: true, value: null}
    //   },
    //   templateUrl: '/app/tasks/html/evaluateLesson.html',
    //   controller: 'EvaluateLessonController as evaluate'
    // })


    // $locationProvider.hashPrefix('')
    // $locationProvider.html5Mode(true)
    $urlRouterProvider.otherwise('/')

  }])
