import { TaskService } from './TaskService'

export class TemplateListController {
  static $inject = ['TaskService', '$scope', '$state', '$timeout', '$location']

  loading = true
  tasks = []
  filter = {}
  levels = ['Beginner', 'Intermediate', 'Advanced']
  categories = ['Grammar', 'Listening', 'Reading', 'Writing']
  initializing = true

  constructor(taskService, $scope, $state, $timeout, $location) {
    this.taskService = taskService
    this.$state = $state
    this.$location = $location
    this.loadTasks()
    $scope.$watch(()=>(this.filter), (newValue, oldValue) => {
      if (this.initializing) {
        $timeout(() => this.initializing = false );
      } else {
        this.filterTasks()
      }
    }, true)
    this.reloadFilter()
  }

  loadTasks(filter = ''){
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
    let selectedLevels = []
    let selectedCategories = []

    for(let level in this.filter.level){
      if(this.filter.level[level]){
        selectedLevels.push(level)
        filter += '&level=' + level
      }
    }
    for(let category in this.filter.category){
      if(this.filter.category[category]){
        selectedCategories.push(category)
        filter += '&category=' + category
      }
    }
    if(this.filter.subject){
      filter = filter + '&subject=' + this.filter.subject
    }
    if(this.filter.name){
      filter = filter + '&name=' + this.filter.name
    }

    if (this.$location.path() === '/templates') {
      this.$state.go('templates', {level: selectedLevels, category: selectedCategories, subject: this.filter.subject, name: this.filter.name})
    } else {
      this.$state.go('asssignTask', {level: selectedLevels, category: selectedCategories, subject: this.filter.subject, name: this.filter.name})
    }

    this.loadTasks(filter)
  }

  reloadFilter(){
    this.filter.level = this.reloadSelectFilter(this.$state.params.level, this.filter.level)
    this.filter.category = this.reloadSelectFilter(this.$state.params.category, this.filter.category)
    this.filter.subject = this.$state.params.subject
    this.filter.name = this.$state.params.name

    this.filterTasks()
  }

  reloadSelectFilter(params, filter){
    if (params) {
      if(Array.isArray(params)){
        for(let key in params){
          filter = {
            ...filter,
            [params[key]]: true
          }
        }
      } else {
        filter = {
          [params]: true
        }
      }
    }
    return filter
  }

  clearFilter(){
    this.filter = {};
    this.loadTasks()
  }

}
