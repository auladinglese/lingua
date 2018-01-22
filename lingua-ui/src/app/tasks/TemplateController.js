import {TaskService} from './TaskService'

export class TemplateController {
  static $inject = [ 'TaskService', '$state', '$stateParams', '$scope', '$window']

  template = {
    teacherId: '1',
    sourceType: 'url',
    questions: [{
        type: 'open',
        answers:  ['', '']
    }]
  }
  levels = ['Beginner', 'Intermediate', 'Advanced']
  categories = ['Grammar', 'Listening', 'Reading', 'Writing']
  savedAlert = false

  constructor(taskService, $state, $stateParams, $scope, $window) {
    this.taskService = taskService
    this.$state = $state
    this.$stateParams = $stateParams
    this.$window = $window

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

  backToTop(){
    this.$window.scroll(0,0)
    this.savedAlert = false
  }

}
