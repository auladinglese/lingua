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

    this.userService.getById(this.$stateParams.studentId)
      .then(student => this.student = student)

    this.getLessonsList()

    if (this.$stateParams.lessonId) {
      if (this.$stateParams.new){
        this.new = 'new'
      }
      this.getTaskList(this.$stateParams.lessonId)
    }

    this.$scope.$watch(()=>this.lessonTasksDetailed, (newValue, oldValue) => {
      if (this.initializing) {
        $timeout(() => this.initializing = false );
      } else {
        if (this.lessonTasksDetailed.length > 0){
          this.tasksUnevaluated = this.lessonTasksDetailed.filter((task) => !task.evaluated).length
          this.tasksIncomplete = this.lessonTasksDetailed.filter((task) => !task.completed).length
        }
      }
    }, true)

    this.$scope.$on('taskUpdate', () => this.getTaskList(this.lesson.id))
    this.$scope.$on('lessonUpdate', () => this.clearTaskList())
    this.$scope.$on('openLesson', (event, args) => this.openLesson(args.lessonId, true))

  }

  getLessonsList(){
    this.lessonService.list('?studentId=' + this.$stateParams.studentId)
      .then(lessons => this.lessons = lessons)
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
    this.clearTaskList()
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

  clearTaskList(){
    this.lesson = null
    this.lessonTasksDetailed = []
    this.new = null
    this.tasksUnevaluated = 1
    this.tasksIncomplete = 1
    this.getLessonsList()
    this.$scope.$broadcast('lessonChange')
    this.$state.go('.', {lessonId: null, new: null})
  }


}
