import { TaskService } from './TaskService'

export class TaskAllController {
  static $inject = ['TaskService', '$scope']

  loading = true
  tasks = []
  filter = {}

  constructor(taskService, $scope) {
    this.taskService = taskService
    this.loadTasks('')
    $scope.$watch(()=>(this.filter), (newValue, oldValue) => {
      this.filterTasks()
    }, true)
  }

  loadTasks(filter){
    this.taskService.list(filter)
      .then(tasks => {
        this.tasks = tasks
        this.loading = false
      }).catch(() => this.loading = false)
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

  filterTasks(){
    let filter = '?'
    if(this.filter.beginner){
      filter = filter + '&level=Beginner'
    }
    if(this.filter.intermediate){
      filter = filter + '&level=Intermediate'
    }
    if(this.filter.advanced){
      filter = filter + '&level=Advanced'
    }
    if(this.filter.writing){
      filter = filter + '&category=Writing'
    }
    if(this.filter.reading){
      filter = filter + '&category=Reading'
    }
    if(this.filter.listening){
      filter = filter + '&category=Listening'
    }
    if(this.filter.grammar){
      filter = filter + '&category=Grammar'
    }
    if(this.filter.subject){
      filter = filter + '&subject=' + this.filter.subject
    }
    if(this.filter.name){
      filter = filter + '&name=' + this.filter.name
    }

    this.loadTasks(filter)
  }

  clearFilter(){
    this.filter = {}
    this.loadTasks('')
  }

}
