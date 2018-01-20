import {TaskService} from './TaskService'

export class TemplateController {
  static $inject = [ 'TaskService', '$state', '$stateParams', '$scope', '$window']

  task = {
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

    if (this.$stateParams.id) {
      this.taskService.getById(this.$stateParams.id)
        .then(task => {
          this.task = task
        })
    }
  }

  saveTask(){
    if(this.$stateParams.id){
      this.taskService.editTask(this.$stateParams.id, this.task)
        .then(() => this.$state.go('templates'))
    } else {
      this.taskService.createNew(this.task)
        .then(() => this.savedAlert = true)
    }
  }

  addAnswer(questionIndex){
    this.task.questions[questionIndex].answers.push('')
  }

  addQuestion(){
    this.task.questions.push({ type: 'open', answers: ['', ''] })
  }

  clearAnswers(questionIndex){
    this.task.questions[questionIndex].answers = ['', '']
  }

  deleteQuestion(i){
    this.task.questions.splice(i, 1)
  }

  deleteAnswer(qi, ai){
      this.task.questions[qi].answers.splice(ai, 1)
  }

  backToTop(){
    this.$window.scroll(0,0)
    this.savedAlert = false
  }

}
