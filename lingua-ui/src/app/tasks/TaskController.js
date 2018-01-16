import {TaskService} from './TaskService'

export class TaskController {
  static $inject = [ 'TaskService', '$state', '$stateParams']

  task = {
    teacher: '1',
    questions: [{
        type: 'open',
        answers:  ['', '']
    }]
  }

  constructor(taskService, $state, $stateParams) {
    this.taskService = taskService
    this.$state = $state
    this.$stateParams = $stateParams

    if (this.$stateParams.id) {
      this.taskService.getById(this.$stateParams.id)
        .then(task => this.task = task)
    }


  }

  saveTask(){
    if(this.$stateParams.id){
      this.taskService.editTask(this.$stateParams.id, this.task)
        .then(() => {
          this.$state.go('alltasks'))
        }
    } else {
      this.taskService.createNew(this.task)
        .then(() => this.$state.go('alltasks'))
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

}
