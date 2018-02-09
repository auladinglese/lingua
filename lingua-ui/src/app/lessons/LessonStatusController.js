import { LessonService } from './LessonService'
import { SecurityContext } from '../auth/SecurityContext'

export class LessonStatusController {
  static $inject = ['LessonService', 'SecurityContext', '$stateParams', '$scope']

  constructor(lessonService, securityContext, $stateParams, $scope) {
    this.lessonService = lessonService
    this.securityContext = securityContext
    this.$stateParams = $stateParams
    this.$scope = $scope

  }

  createLesson(){
    const lesson = {
      teacherId: this.securityContext.getUser().userId,
      studentId: this.$stateParams.studentId,
      tasks: []
    }
    this.lessonService.createNew(lesson)
      .then(lesson => this.$scope.$emit('openLesson', {lessonId: lesson.id}))
  }

  deleteLesson(lesson){
    this.deleteLessonWarning = true
    this.lessonToDelete = lesson
  }

  deleteLessonConfirmed(){
    this.deleteLessonWarning = false
    this.lessonService.delete(this.lessonToDelete.id)
      .then(() => this.$scope.$emit('lessonUpdate'))
  }

  assignLesson(lesson){
    lesson.dateAssigned = moment()
    this.lessonService.update(lesson.id, lesson)
      .then(() => this.$scope.$emit('lessonUpdate'))
  }

  submitEvaluation(lesson){
    lesson.dateEvaluated = moment()
    this.lessonService.update(lesson.id, lesson)
      .then(() => this.$scope.$emit('lessonUpdate'))
  }

  submitLesson(lesson){
    lesson.dateSubmitted = moment()
    this.lessonService.update(lesson.id, lesson)
      .then(() => this.$scope.$emit('lessonUpdate'))
  }

}
