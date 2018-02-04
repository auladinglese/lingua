import { TaskService } from './TaskService'
import { LessonService } from './LessonService'
import { SecurityContext } from '../auth/SecurityContext'
import moment from 'moment'



export class CompleteLessonController {
  static $inject = ['TaskService', 'LessonService', 'SecurityContext', '$stateParams', '$state']

  task = {}
  lessonTasks = []
  allTasksCompleted = false

  constructor(taskService, lessonService, securityContext, $stateParams, $state) {
    this.taskService = taskService
    this.lessonService = lessonService
    this.securityContext = securityContext
    this.$stateParams = $stateParams
    this.$state = $state

    this.lessonService.list()
      .then(lessons => {
        this.lessons = lessons.filter(lesson => lesson.studentId === this.securityContext.getUser().userId)
      })

    if(this.$stateParams.lessonId){
      this.getTaskList(this.$stateParams.lessonId)
    }

    if (this.$stateParams.taskId) {
      this.taskService.getById(this.$stateParams.taskId)
        .then(task => {
          this.task = task
        })
    }
  }

  getTaskList(lessonId){
    return this.lessonService.getById(lessonId)
      .then(lesson => {
        this.openedLesson = lesson
        if(lesson.tasks.length > 0){
          lesson.tasks.forEach(task => this.getTaskDetails(task))
        }
      })
  }

  getTaskDetails(taskId){
    this.lessonTasks = []
    this.taskService.getById(taskId)
      .then(task => {
        this.lessonTasks.push(task)
        this.checkIfCompleted()
      })
  }

  checkIfCompleted(){
    let incomplete = this.lessonTasks.filter((task) => !task.completed).length
    if(incomplete === 0){
      this.allTasksCompleted = true
    } else {
      this.allTasksCompleted = false
    }
  }

  openLesson(lessonId, unassigned = false){
    this.getTaskList(lessonId)
      .then(() => {
        this.task = {}
        if (unassigned){
          this.new = 'new'
        }
        this.$state.go('.', {lessonId: lessonId, taskId: null, new: this.new})
      })
  }

  openTask(taskId){
    this.taskService.getById(taskId)
      .then(task => {
        this.task = task
        this.$state.go('.', {taskId: taskId})
      })
  }

  closeTask(){
    this.task = {}
    this.$state.go('.', {taskId: null})
  }

  saveTask(){
    this.task.dateWorked = moment()
    this.taskService.editTask(this.task.id, this.task)
      .then(() => {
        this.openLesson(this.openedLesson.id)
        this.$state.go('completeLesson', {lessonId: this.openedLesson.id, taskId: null}
      )})
  }

  submitLesson(){
    this.openedLesson.dateSubmitted = moment()
    this.lessonService.update(this.openedLesson.id, this.openedLesson)
      .then(() => this.$state.reload())
  }

  saveEvaluation(){
    this.task.evaluated = true
    this.taskService.editTask(this.task.id, this.task)
      .then(() => {
        this.task = {}
        this.$state.go('.', {taskId: null}, { reload: true })
      })
  }



}
