import { TaskService } from './TaskService'

export class TaskController {
  static $inject = ['TaskService', '$stateParams', '$state', '$scope']

  constructor(taskService, $stateParams, $state, $scope) {
    this.taskService = taskService
    this.$state = $state
    this.$scope = $scope

    if ($stateParams.taskId) {
      this.taskService.getById($stateParams.taskId)
        .then(task => this.task = task)
    }

    this.$scope.$on('lessonChange', () => this.task = {})
  }

  openTask(taskId){
    this.taskService.getById(taskId)
      .then(task => {
        this.task = task
        this.$state.go('.', {taskId: taskId})
      })
  }

  closeTask(){
    this.task = {}
    this.$state.go('.', {taskId: null})
  }

  saveTaskAnswers(){
    this.task.dateWorked = moment()
    this.taskService.editTask(this.task.id, this.task)
      .then(() => this.taskUpdate())
  }

  saveTaskEvaluation(){
    this.task.evaluated = true
    this.taskService.editTask(this.task.id, this.task)
      .then(() => this.taskUpdate())
  }

  taskUpdate(){
    this.closeTask()
    this.$scope.$emit('taskUpdate')
  }



}
