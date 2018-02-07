import { TaskService } from './TaskService'
import { LessonService } from './LessonService'
import { SecurityContext } from '../auth/SecurityContext'
import moment from 'moment'

export class TaskController {
  static $inject = ['TaskService', 'LessonService', 'SecurityContext', '$stateParams', '$state', '$scope']

  constructor(taskService, lessonService, securityContext, $stateParams, $state, $scope) {
    this.taskService = taskService
    this.lessonService = lessonService
    this.securityContext = securityContext
    this.$state = $state

    $scope.$watch(()=>$stateParams.taskId, (newValue, oldValue) => {
      if ($stateParams.taskId) {
        this.taskService.getById($stateParams.taskId)
          .then(task => {
            this.task = task
          })
      } else {
        this.task = {}
      }
    }, true)

  }

  openTask(taskId){
    this.taskService.getById(taskId)
      .then(task => {
        this.task = task
        this.$state.go('.', {taskId: taskId})
      })
  }

  closeTask(){
    this.$state.go('.', {taskId: null})
  }

  saveTaskAnswers(){
    this.task.dateWorked = moment()
    this.taskService.editTask(this.task.id, this.task)
      .then(() => this.$state.go('.', {taskId: null}))
  }

  saveTaskEvaluation(){
    this.task.evaluated = true
    this.taskService.editTask(this.task.id, this.task)
    .then(() => this.$state.go('.', {taskId: null}))
  }



}
