import { TaskService } from './TaskService'

export class TemplateListController {
  static $inject = ['TaskService', '$scope', '$state', '$timeout', '$location']

  loading = true
  templates = []
  filter = {}
  levels = ['Beginner', 'Intermediate', 'Advanced']
  categories = ['Grammar', 'Listening', 'Reading', 'Writing']
  initializing = true

  constructor(taskService, $scope, $state, $timeout, $location) {
    this.taskService = taskService
    this.$state = $state
    this.$location = $location
    this.reloadFilter()
    $scope.$watch(()=>this.filter, (newValue, oldValue) => {
      if (this.initializing) {
        $timeout(() => this.initializing = false );
      } else {
        this.filterTemplates()
      }
    }, true)
  }

  loadTemplates(filter = ''){
    this.taskService.list(filter)
      .then(templates => {
        this.templates = templates
        this.loading = false
      }).catch(() => this.loading = false)
  }

  delete(template) {
    this.taskService.delete(template.id)
      .then(() => {
        const index = this.templates.indexOf(template)
        if (index >= 0) {
          this.templates.splice(index, 1)
        }
      })
  }

  filterTemplates(){
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
      this.$state.go('assignLesson', {level: selectedLevels, category: selectedCategories, subject: this.filter.subject, name: this.filter.name})
    }

    this.loadTemplates(filter)
  }

  reloadFilter(){
    this.filter.level = this.reloadSelectFilter(this.$state.params.level, this.filter.level)
    this.filter.category = this.reloadSelectFilter(this.$state.params.category, this.filter.category)
    this.filter.subject = this.$state.params.subject
    this.filter.name = this.$state.params.name

    this.filterTemplates()
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
    this.loadTemplates()
  }

}
