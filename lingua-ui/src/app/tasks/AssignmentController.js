import { TaskService } from './TaskService'
import { LessonService } from './LessonService'
import moment from 'moment'



export class AssignmentController {
  static $inject = ['TaskService', 'LessonService', '$stateParams', '$state', '$window']

  lessonTasks = []
  teacherId = '1'
  studentId = '1'
  saveAsTemplate = false

  constructor(taskService, lessonService, $stateParams, $state, $window) {
    this.taskService = taskService
    this.lessonService = lessonService
    this.$stateParams = $stateParams
    this.$state = $state
    this.$window = $window

    if (this.$stateParams.lessonId) {
      this.lessonService.getById(this.$stateParams.lessonId)
        .then(lesson => {
          this.lesson = lesson
          if(lesson.tasks.length > 0){
            lesson.tasks.forEach(task => this.getTasks(task))
          }
        })
    }
  }

  getTasks(taskId){
    this.taskService.getById(taskId)
      .then(task => {
        this.lessonTasks.push(task)
      })
  }

  createLesson(){
    this.lesson = {
      teacherId: this.teacherId,
      studentId: this.studentId,
      tasks: []
    }
    this.lessonService.createNew(this.lesson)
      .then(lesson => this.$state.go('assignLesson', {lessonId: lesson.id}))
  }

  assignLesson(){
    this.lesson.dateAssigned = moment()
    this.lessonService.update(this.$stateParams.lessonId, this.lesson)
      .then(lesson => this.$state.go('assignLesson', {lessonId: null}))
  }

  addTask(task){
    task.studentId = this.studentId
    this.taskService.createNew(task)
      .then((task) => {
        this.lesson.tasks.push(task.id)
        this.lessonService.update(this.$stateParams.lessonId, this.lesson)
          .then(() => {
            if (this.saveAsTemplate){
              task.studentId = null
              this.taskService.createNew(task)
            }
            this.$state.reload()
            this.$window.scroll(0,0)
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


}
