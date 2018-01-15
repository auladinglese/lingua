import {TaskService} from './TaskService'

export class TaskAllController {
  static $inject = ['TaskService']

  constructor(taskService) {
    this.tasks = []
    this.taskService = taskService
    this.taskService.list()
      .then(tasks => (this.tasks = tasks))
  }

  delete(task) {
    this.taskService.delete(task.id)
      .then(() => {
        const index = this.tasks.indexOf(task)
        if (index >= 0) {
          this.tasks.splice(index, 1)
        }
      })

  }
}
