import {TaskService} from './TaskService'

export class TaskNewController {
  static $inject = [ 'TaskService', '$sce', '$state']

  task = {
    questions: [{
        type: 'open',
        answers:  ['', '']
    }]
  }

  constructor(taskService, $sce, $state) {
    this.taskService = taskService
    this.$sce = $sce
    this.$state = $state

  }


  saveTask(){
    this.taskService.createNew(this.task)
      .then(() => this.$state.go('alltasks'))
  }

  addAnswer(questionIndex){
    this.task.questions[questionIndex].answers.push('')
  }

  addQuestion(){
    console.log(this.task)
    this.task.questions.push({ type: 'open', answers: ['', ''] })
  }

  clearAnswers(questionIndex){
    this.task.questions[questionIndex].answers = ['', '']
  }

  deleteQ(i){
    this.task.questions.splice(i, 1)
  }

  deleteA(qi, ai){
      this.task.questions[qi].answers.splice(ai, 1)
  }

}
