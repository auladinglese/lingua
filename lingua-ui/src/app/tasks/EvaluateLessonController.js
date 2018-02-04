// import { TaskService } from './TaskService'
// import { LessonService } from './LessonService'
// import moment from 'moment'
//
//
//
// export class EvaluateLessonController {
//   static $inject = ['TaskService', 'LessonService', '$stateParams', '$state']
//
//   task = {}
//   studentId = 'd24e7dc1-ca73-4bbd-ac70-a95438fe1a82'
//   lessonTasks = []
//   allTasksCompleted = false
//
//   constructor(taskService, lessonService, $stateParams, $state) {
//     this.taskService = taskService
//     this.lessonService = lessonService
//     this.$stateParams = $stateParams
//     this.$state = $state
//
//     this.lessonService.list()
//       .then(lessons => {
//         this.lessons = lessons.filter(lesson => lesson.studentId === this.studentId)
//       })
//
//     if(this.$stateParams.lessonId){
//       this.getTaskList(this.$stateParams.lessonId)
//     }
//
//     if (this.$stateParams.taskId) {
//       this.taskService.getById(this.$stateParams.taskId)
//         .then(task => {
//           this.task = task
//         })
//     }
//   }
//
//   getTaskList(lessonId){
//     return this.lessonService.getById(lessonId)
//       .then(lesson => {
//         this.openedLesson = lesson
//         if(lesson.tasks.length > 0){
//           lesson.tasks.forEach(task => this.getTaskDetails(task))
//         }
//       })
//   }
//
//   getTaskDetails(taskId){
//     this.lessonTasks = []
//     this.taskService.getById(taskId)
//       .then(task => {
//         this.lessonTasks.push(task)
//         this.checkIfCompleted()
//       })
//   }
//
//   checkIfCompleted(){
//     let unevaluated = this.lessonTasks.filter((task) => !task.evaluated).length
//     if(unevaluated === 0){
//       this.allTasksEvaluated = true
//     } else {
//       this.allTasksEvaluated = false
//     }
//   }
//
//   openLesson(lessonId){
//     this.getTaskList(lessonId)
//       .then(() => {
//         this.task = {}
//         this.$state.go('.', {lessonId: lessonId, taskId: null})
//       })
//   }
//
//   openTask(taskId){
//     this.taskService.getById(taskId)
//       .then(task => {
//         this.task = task
//         this.$state.go('.', {taskId: taskId})
//       })
//   }
//
//   closeTask(){
//     this.task = {}
//     this.$state.go('.', {taskId: null})
//   }
//
//   saveEvaluation(){
//     this.task.evaluated = true
//     this.taskService.editTask(this.task.id, this.task)
//       .then(() => {
//         this.openLesson(this.openedLesson.id)
//         this.$state.go('.', {lessonId: this.openedLesson.id, taskId: null}
//       )})
//   }
//
//   sendEvaluation(){
//     this.openedLesson.dateEvaluated = moment()
//     this.lessonService.update(this.openedLesson.id, this.openedLesson)
//       .then(() => this.$state.go('.', {lessonId: null}))
//   }
//
//
// }
