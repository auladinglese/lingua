import { TaskService } from './TaskService'
import { LessonService } from './LessonService'
import { UserService } from '../auth/UserService'
import { SecurityContext } from '../auth/SecurityContext'
import moment from 'moment'



export class AssignmentController {
  static $inject = ['TaskService', 'LessonService', 'UserService', 'SecurityContext', '$stateParams', '$state', '$window']

  lessonTasks = []
  saveAsTemplate = false

  constructor(taskService, lessonService, userService, securityContext, $stateParams, $state, $window) {
    this.taskService = taskService
    this.lessonService = lessonService
    this.userService = userService
    this.securityContext = securityContext
    this.$stateParams = $stateParams
    this.$state = $state
    this.$window = $window

    if (this.$stateParams.studentId){
      this.userService.getById(this.$stateParams.studentId)
        .then(student => {
          this.student = student
          this.lessonService.list()
            .then(lessons => {
              this.lessons = lessons.filter(lesson => lesson.studentId === this.$stateParams.studentId)
            })
        })
    }
    if (this.$stateParams.lessonId) {
      this.lessonService.getById(this.$stateParams.lessonId)
        .then(lesson => {
          this.lesson = lesson
          if(lesson.tasks.length > 0){
            lesson.tasks.forEach(task => this.getTaskDetails(task))
          }
        })
    }
  }

  getTaskDetails(taskId){
    this.taskService.getById(taskId)
      .then(task => {
        this.lessonTasks.push(task)
        this.checkIfAllTasksCompleted()
      })
  }

  checkIfAllTasksCompleted(){
    let unevaluated = this.lessonTasks.filter((task) => !task.evaluated).length
    if(unevaluated === 0){
      this.allTasksEvaluated = true
    } else {
      this.allTasksEvaluated = false
    }
  }

  createLesson(){
    this.lesson = {
      teacherId: this.securityContext.getUser().userId,
      studentId: this.$stateParams.studentId,
      tasks: []
    }
    this.lessonService.createNew(this.lesson)
      .then(lesson => this.$state.go('.', {lessonId: lesson.id, new: 'new'}))
  }

  assignLesson(){
    this.lesson.dateAssigned = moment()
    this.lessonService.update(this.$stateParams.lessonId, this.lesson)
      .then(lesson => this.$state.go('.', {lessonId: null, new: null}))
  }

  newTask(){
    this.$state.go('addTask', {studentId: this.$stateParams.studentId, lessonId: this.$stateParams.lessonId, level: this.$stateParams.level, category: this.$stateParams.category, subject: this.$stateParams.subject, name: this.$stateParams.name, templateId: null, taskId: null})
  }

  backToAssignment(){
    this.$state.go('assignLesson', {studentId: this.$stateParams.studentId, lessonId: this.$stateParams.lessonId, level: this.$stateParams.level, category: this.$stateParams.category, subject: this.$stateParams.subject, name: this.$stateParams.name, new: 'new'})
  }

  addTask(task){
    task.studentId = this.$stateParams.studentId
    this.taskService.createNew(task)
      .then((task) => {
        this.lesson.tasks.push(task.id)
        this.lessonService.update(this.$stateParams.lessonId, this.lesson)
          .then(() => {
            if (this.saveAsTemplate){
              task.studentId = null
              this.taskService.createNew(task)
            }
            this.$state.go('assignLesson', {studentId: this.$stateParams.studentId, lessonId: this.$stateParams.lessonId, new:'new', level: this.$stateParams.level, category: this.$stateParams.category, subject: this.$stateParams.subject, name: this.$stateParams.name})
          })
      })
  }

  deleteTask(task) {
    this.taskService.delete(task.id)
      .then(() => {
        const index = this.lesson.tasks.indexOf(task.id)
        if (index >= 0) {
          this.lesson.tasks.splice(index, 1)
        }
        this.lessonService.update(this.$stateParams.lessonId, this.lesson)
          .then(() => this.$state.reload())
      })
  }

  deleteLesson(){
    this.lessonService.delete(this.$stateParams.lessonId)
      .then(() => this.$state.go('.', {lessonId: null, taskId: null}))
  }

  submitEvaluation(){
    this.lesson.dateEvaluated = moment()
    this.lessonService.update(this.lesson.id, this.lesson)
      .then(() => this.$state.go('.', {lessonId: null, taskId: null}))
  }

}
