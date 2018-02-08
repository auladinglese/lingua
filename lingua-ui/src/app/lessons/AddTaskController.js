import { TaskService } from './TaskService'
import { LessonService } from './LessonService'
import moment from 'moment'


export class AddTaskController {
  static $inject = ['TaskService', 'LessonService', '$stateParams', '$state', '$scope']

  lessonTasksDetailed = []
  saveAsTemplate = false
  initializing = true

  constructor(taskService, lessonService, $stateParams, $state, $scope) {
    this.taskService = taskService
    this.lessonService = lessonService
    this.$stateParams = $stateParams
    this.$state = $state
    this.$scope = $scope

    if ($stateParams.lessonId) {
      this.lessonService.getById($stateParams.lessonId)
        .then(lesson => this.lesson = lesson)
    }

  }

  addTaskToLesson(task){
    task.studentId = this.$stateParams.studentId
    this.taskService.createNew(task)
      .then((task) => {
        this.saveTemplate(task)
        this.lesson.tasks.push(task.id)
        this.lessonService.update(this.lesson.id, this.lesson)
          .then(() => this.backToLesson())
      })
  }

  saveTemplate(task){
    if (this.saveAsTemplate){
      task.studentId = null
      this.taskService.createNew(task)
    }
  }

  deleteTask(task) {
    this.taskService.delete(task.id)
      .then(() => {
        this.lesson.tasks.splice(this.lesson.tasks.indexOf(task.id), 1)
        this.lessonService.update(this.lesson.id, this.lesson)
          .then(lesson => this.$scope.$emit('openLesson', {lessonId: lesson.id}))
      })
  }

  toNewTask(){
    this.$state.go('addTask', {studentId: this.$stateParams.studentId, lessonId: this.$stateParams.lessonId, level: this.$stateParams.level, category: this.$stateParams.category, subject: this.$stateParams.subject, name: this.$stateParams.name, templateId: null, taskId: null})
  }

  backToLesson(){
    this.$state.go('lessons', {studentId: this.$stateParams.studentId, lessonId: this.$stateParams.lessonId, level: this.$stateParams.level, category: this.$stateParams.category, subject: this.$stateParams.subject, name: this.$stateParams.name, new: 'new'})
  }

}
