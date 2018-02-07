import { TaskService } from './TaskService'
import { SecurityContext } from '../auth/SecurityContext'

export class TemplateListController {
  static $inject = ['TaskService', 'SecurityContext', '$scope', '$state', '$timeout']

  loading = true
  templates = []
  filter = {}
  levels = ['Beginner', 'Intermediate', 'Advanced']
  categories = ['Grammar', 'Listening', 'Reading', 'Writing']
  initializing = true

  constructor(taskService, securityContext, $scope, $state, $timeout) {
    this.taskService = taskService
    this.securityContext = securityContext
    this.$state = $state
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
        this.templates = templates.filter(template => template.teacherId === this.securityContext.getUser().userId && !template.studentId)
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

    this.$state.go('.', {level: selectedLevels, category: selectedCategories, subject: this.filter.subject, name: this.filter.name})

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
