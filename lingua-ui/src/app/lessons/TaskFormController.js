import {TaskService} from './TaskService'
import { SecurityContext } from '../auth/SecurityContext'


export class TaskFormController {
  static $inject = [ 'TaskService', 'SecurityContext', '$state', '$stateParams', '$scope', '$window']

  levels = ['Beginner', 'Intermediate', 'Advanced']
  categories = ['Grammar', 'Listening', 'Reading', 'Writing']
  savedAlert = false

  constructor(taskService, securityContext, $state, $stateParams, $scope, $window) {
    this.taskService = taskService
    this.securityContext = securityContext
    this.$state = $state
    this.$stateParams = $stateParams
    this.$window = $window

    this.template = {
      teacherId: this.securityContext.getUser().userId,
      sourceType: 'url',
      questions: [{
          type: 'open',
          answers:  ['', '']
      }]
    }

    if (this.$stateParams.templateId) {
      this.taskService.getById(this.$stateParams.templateId)
        .then(template => {
          this.template = template
        })
    }
  }

  saveTemplate(){
    if(this.$stateParams.templateId){
      this.taskService.editTask(this.$stateParams.templateId, this.template)
        .then(() => this.$state.go('templates'))
    } else {
      this.taskService.createNew(this.template)
        .then(() => this.savedAlert = true)
    }
  }

  addAnswer(questionIndex){
    this.template.questions[questionIndex].answers.push('')
  }

  addQuestion(){
    this.template.questions.push({ type: 'open', answers: ['', ''] })
  }

  clearAnswers(questionIndex){
    this.template.questions[questionIndex].answers = ['', '']
  }

  deleteQuestion(i){
    this.template.questions.splice(i, 1)
  }

  deleteAnswer(qi, ai){
      this.template.questions[qi].answers.splice(ai, 1)
  }

  resetForm(){
    this.$state.reload()
  }

  backToTop(){
    this.$window.scroll(0,0)
    this.savedAlert = false
  }

}
