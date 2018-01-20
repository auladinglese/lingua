import { TaskService } from './TaskService'
import moment from 'moment'



export class AssignmentController {
  static $inject = ['TaskService', '$stateParams', '$state', '$window']

  task = {}
  assignedTasks = []
  studentId = '1'
  teacherId = '1'
  savedAlert = false

  constructor(taskService, $stateParams, $state, $window) {
    this.taskService = taskService
    this.$stateParams = $stateParams
    this.$state = $state
    this.$window = $window

    this.taskService.list('')
      .then(tasks => {
        this.assignedTasks = tasks.filter(task => task.studentId === this.studentId)
      })

  }

  assignTask(template){
    this.task = template
    this.task.studentId = this.studentId
    this.task.teacherId = this.teacherId
    this.task.dateAssigned = moment()
    this.taskService.createNew(this.task)
      .then(() => {
        this.$state.reload()
        this.$window.scroll(0,0)
      })
  }

  deleteTask(task) {
    this.taskService.delete(task.id)
      .then(() => {
        const index = this.assignedTasks.indexOf(task)
        if (index >= 0) {
          this.assignedTasks.splice(index, 1)
        }
      })
  }


}
