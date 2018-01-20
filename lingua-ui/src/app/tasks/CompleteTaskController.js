import { TaskService } from './TaskService'
import moment from 'moment'



export class CompleteTaskController {
  static $inject = ['TaskService', '$stateParams', '$state', '$window']

  task = {}

  constructor(taskService, $stateParams, $state, $window) {
    this.taskService = taskService
    this.$stateParams = $stateParams
    this.$state = $state
    this.$window = $window

    if (this.$stateParams.id) {
      this.taskService.getById(this.$stateParams.id)
        .then(task => {
          this.task = task
          console.log(this.task)
        })
    }

  }

  saveTask(){
    this.task.dateCompleted = moment()
    this.taskService.editTask(this.$stateParams.id, this.task)
      .then(() => this.$state.go('completeTask', {id: null}))
  }




}
