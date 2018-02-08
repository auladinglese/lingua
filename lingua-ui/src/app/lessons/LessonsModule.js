import angular from 'angular'
import { TaskFormController } from './TaskFormController'
import { TemplateListController } from './TemplateListController'
import { LessonController } from './LessonController'
import { LessonStatusController } from './LessonStatusController'
import { TaskController } from './TaskController'
import { AddTaskController } from './AddTaskController'
import { TaskService } from './TaskService'
import { LessonService } from './LessonService'
import '@uirouter/angularjs'

angular.module('lessons', ['ui.router'])
  .controller('TaskFormController', TaskFormController)
  .controller('TemplateListController', TemplateListController)
  .controller('LessonController', LessonController)
  .controller('LessonStatusController', LessonStatusController)
  .controller('TaskController', TaskController)
  .controller('AddTaskController', AddTaskController)
  .service('TaskService', TaskService)
  .service('LessonService', LessonService)
  .config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state({
      name: 'taskForm',
      url: '/template/:templateId',
      params: {
        templateId: {value: null},
      },
      templateUrl: '/app/lessons/html/taskTemplate.html',
      controller: 'TaskFormController as form'
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
      templateUrl: '/app/lessons/html/templates.html',
      controller: 'TemplateListController as templates'
    })
    $stateProvider.state({
      name: 'lessons',
      url: '/lessons/studentID::studentId&:lessonId&:taskId&:new?level&category&subject&name',
      params: {
        lessonId: {dynamic: true, value: null},
        new: {dynamic: true, value: null},
        taskId: {dynamic: true, value: null},
        level: {dynamic: true},
        category: {dynamic: true},
        subject: {dynamic: true},
        name: {dynamic: true}
      },
      templateUrl: '/app/lessons/html/lessons.html',
      controller: 'LessonController as lessonCtrl'
    })
    $stateProvider.state({
      name: 'addTask',
      url: '/add-task/studentID::studentId&:lessonId&:templateId?level&category&subject&name',
      params: {
        templateId: {value: null},
        level: {dynamic: true},
        category: {dynamic: true},
        subject: {dynamic: true},
        name: {dynamic: true}
      },
      templateUrl: '/app/lessons/html/addTask.html',
      controller: 'LessonController as lessonCtrl'
    })
  }])
