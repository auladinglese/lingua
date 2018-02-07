import { TaskService } from './TaskService'
import { LessonService } from './LessonService'
import { UserService } from '../auth/UserService'
import { SecurityContext } from '../auth/SecurityContext'
import moment from 'moment'


export class LessonController {
  static $inject = ['TaskService', 'LessonService', 'UserService', 'SecurityContext', '$stateParams', '$state', '$scope', '$timeout']

  lessonTasksDetailed = []
  saveAsTemplate = false
  initializing = true

  constructor(taskService, lessonService, userService, securityContext, $stateParams, $state, $scope, $timeout) {
    this.taskService = taskService
    this.lessonService = lessonService
    this.userService = userService
    this.securityContext = securityContext
    this.$stateParams = $stateParams
    this.$state = $state
    this.$scope = $scope

    this.getLessonsList()

    if (this.$stateParams.lessonId) {
      if (this.$stateParams.new){
        this.new = 'new'
      }
      this.getTaskList(this.$stateParams.lessonId)
    }

    $scope.$watch(()=>this.$state.params.taskId, (newValue, oldValue) => {
      if (!this.$state.params.taskId && this.lesson) {
        this.openLesson(this.lesson.id, this.new? true : false )
      }
    }, true)

    $scope.$watch(()=>this.lessonTasksDetailed, (newValue, oldValue) => {
      if (this.initializing) {
        $timeout(() => this.initializing = false );
      } else {
        if (this.lessonTasksDetailed.length > 0){
          this.tasksUnevaluated = this.lessonTasksDetailed.filter((task) => !task.evaluated).length
          this.tasksIncomplete = this.lessonTasksDetailed.filter((task) => !task.completed).length
        }
      }
    }, true)


  }

  getLessonsList(){
    if (this.$stateParams.studentId){
      this.userService.getById(this.$stateParams.studentId)
        .then(student => {
          this.student = student
          this.lessonService.list('?studentId=' + this.$stateParams.studentId)
            .then(lessons => this.lessons = lessons)
        })
    } else {
      this.lessonService.list('?studentId=' + this.securityContext.getUser().userId)
        .then(lessons => this.lessons = lessons)
    }
  }

  getTaskList(lessonId){
    return this.lessonService.getById(lessonId)
      .then(lesson => {
        this.lesson = lesson
        if(lesson.tasks.length > 0){
          this.lessonTasksDetailed = []
          lesson.tasks.forEach(task => this.getTaskDetails(task))
        }
      })
  }

  getTaskDetails(taskId){
    this.taskService.getById(taskId)
      .then(task => {
        this.lessonTasksDetailed.push(task)
      })
  }

  openLesson(lessonId, unassigned = false){
    this.getTaskList(lessonId)
      .then(() => {
        if (unassigned){
          this.new = 'new'
        } else {
          this.new = null
        }
        this.$state.go('.', {lessonId: lessonId, taskId: null, new: this.new})
      })
  }

  createLesson(){
    this.clearView()
    this.lesson = {
      teacherId: this.securityContext.getUser().userId,
      studentId: this.$stateParams.studentId,
      tasks: []
    }
    this.lessonService.createNew(this.lesson)
      .then(lesson => {
        this.getLessonsList()
        this.openLesson(lesson.id, true)
        this.$state.go('.', {lessonId: lesson.id, new: 'new'})
      })
  }

  addTask(task){
    task.studentId = this.$stateParams.studentId
    this.taskService.createNew(task)
      .then((task) => {
        this.lesson.tasks.push(task.id)
        this.lessonService.update(this.$state.params.lessonId, this.lesson)
          .then(() => {
            if (this.saveAsTemplate){
              task.studentId = null
              this.taskService.createNew(task)
            }
            this.backToLesson()
          })
      })
  }

  deleteTask(task) {
    this.taskService.delete(task.id)
      .then(() => {
        this.lesson.tasks.splice(this.lesson.tasks.indexOf(task.id), 1)
        this.lessonService.update(this.lesson.id, this.lesson)
          .then(lesson => {
            this.lessonTasksDetailed = []
            this.openLesson(this.lesson.id, true)
          })
      })
  }

  deleteLesson(){
    this.lessonService.delete(this.lesson.id)
      .then(() => this.clearView())
  }

  assignLesson(){
    this.lesson.dateAssigned = moment()
    this.lessonService.update(this.lesson.id, this.lesson)
      .then(() => this.clearView())
  }

  submitLesson(){
    this.lesson.dateSubmitted = moment()
    this.lessonService.update(this.lesson.id, this.lesson)
      .then(() => {
        this.getLessonsList()
        this.openLesson(this.lesson.id)
      })
  }

  submitEvaluation(){
    this.lesson.dateEvaluated = moment()
    this.lessonService.update(this.lesson.id, this.lesson)
      .then(() => this.clearView())
  }

  clearView(){
    this.lesson = null
    this.lessonTasksDetailed = []
    this.new = null
    this.tasksUnevaluated = 1
    this.getLessonsList()
    this.$state.go('.', {lessonId: null, new: null})
  }

  toNewTask(){
    this.$state.go('addTask', {studentId: this.$stateParams.studentId, lessonId: this.$state.params.lessonId, level: this.$stateParams.level, category: this.$stateParams.category, subject: this.$stateParams.subject, name: this.$stateParams.name, templateId: null, taskId: null})
  }

  backToLesson(){
    this.$state.go('lessons', {studentId: this.$stateParams.studentId, lessonId: this.$stateParams.lessonId, level: this.$stateParams.level, category: this.$stateParams.category, subject: this.$stateParams.subject, name: this.$stateParams.name, new: 'new'})
  }

}
