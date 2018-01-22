import angular from 'angular'
import { TemplateController } from './tasks/TemplateController'
import { TemplateListController } from './tasks/TemplateListController'
import { AssignmentController } from './tasks/AssignmentController'
import { CompleteLessonController } from './tasks/CompleteLessonController'
import { MarkLessonController } from './tasks/MarkLessonController'
import { TaskService } from './tasks/TaskService'
import { LessonService } from './tasks/LessonService'
import '@uirouter/angularjs'

angular.module('app', ['ui.router'])
  .controller('TemplateController', TemplateController)
  .controller('TemplateListController', TemplateListController)
  .controller('AssignmentController', AssignmentController)
  .controller('CompleteLessonController', CompleteLessonController)
  .controller('MarkLessonController', MarkLessonController)
  .service('TaskService', TaskService)
  .service('LessonService', LessonService)
  .config(['$stateProvider', '$urlRouterProvider', /*'$locationProvider',*/ ($stateProvider, $urlRouterProvider /*, $locationProvider*/) => {

    $stateProvider.state({
      name: 'home',
      url: '/',
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
      url: '/assignment/lesson-:lessonId/:templateId?level&category&subject&name',
      params: {
        lessonId: {value: null},
        templateId: {value: null},
        level: {dynamic: true},
        category: {dynamic: true},
        subject: {dynamic: true},
        name: {dynamic: true}
      },
      templateUrl: '/app/tasks/html/assignLesson.html',
      controller: 'AssignmentController as assign'
    })
    $stateProvider.state({
      name: 'completeLesson',
      url: '/my-lessons/lesson:lessonId/:taskId',
      params: {
        lessonId: {dynamic: true, value: null},
        taskId: {dynamic: true, value: null}
      },
      templateUrl: '/app/tasks/html/completeLesson.html',
      controller: 'CompleteLessonController as complete'
    })
    $stateProvider.state({
      name: 'markLesson',
      url: '/masrk-lessons',
      templateUrl: '/app/tasks/html/markLesson.html',
      controller: 'MarkLessonController as mark'
    })


    // $locationProvider.hashPrefix('')
    // $locationProvider.html5Mode(true)
    $urlRouterProvider.otherwise('/')

  }])
