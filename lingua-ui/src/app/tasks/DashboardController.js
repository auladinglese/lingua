import { SecurityContext } from '../auth/SecurityContext'
import { UserService } from '../auth/UserService'
import { ProfileService } from './ProfileService'
import { LessonService } from './LessonService'
import { AppointmentService } from './AppointmentService'
import moment from 'moment'


export class DashboardController {
  static $inject = ['SecurityContext', 'UserService', 'ProfileService', 'LessonService', 'AppointmentService', '$stateParams', '$state', '$window', '$scope']

  myStudents = []
  newStudents = []
  evalStudents = []
  assignStudents = []
  teacherApts = []
  updatedMessage = false
  times = ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30']
  durations = ['15 min', '30 min', '1 h', '1.5 h', '2 h']

  constructor(securityContext, userService, profileService, lessonService, appointmentService, $stateParams, $state, $window, $scope) {
    this.securityContext = securityContext
    this.userService = userService
    this.profileService = profileService
    this.lessonService = lessonService
    this.appointmentService = appointmentService
    this.$stateParams = $stateParams
    this.$state = $state
    this.$window = $window
    this.$scope = $scope

    this.userService.list('?role=student')
      .then(students => {
        students.forEach(student => {
          this.profileService.list('?userId=' + student.id)
            .then(profile => {
              if(profile[0].currentTeacherId === this.securityContext.getUser().userId && profile[0].teacherConfirmed){
                this.myStudents.push(student)
                this.lessonService.list('?studentId=' + student.id)
                  .then(lessons => {
                    const countNoAssigned = lessons.filter(lesson => lesson.dateAssigned && !lesson.dateSubmitted).length
                    const nameOnList = this.assignStudents.filter(s => s.username === student.username).length
                    if (countNoAssigned === 0 && nameOnList === 0) {
                      this.assignStudents.push(student)
                    }
                  })
              } else if (profile[0].currentTeacherId === this.securityContext.getUser().userId && !profile[0].teacherConfirmed){
                this.newStudents.push(student)
              }
            })
        })
      })

    this.userService.list('?role=teacher')
      .then(teachers => this.teachers = teachers)

    this.profileService.list('?userId=' + this.securityContext.getUser().userId)
      .then(profile => {
        this.profile = profile[0]
        if(this.profile.currentTeacherId) {
          this.userService.getById(this.profile.currentTeacherId)
            .then(teacher => this.teacher = teacher)
          this.profileService.list('?userId=' + this.profile.currentTeacherId)
            .then(teacherProfile => this.teacherProfile = teacherProfile[0])
        }

      })

    this.lessonService.list('?studentId=' + this.securityContext.getUser().userId)
      .then(lessons => {
        this.countAssigned = lessons.filter(lesson => !lesson.dateSubmitted && lesson.dateAssigned).length
        this.countAwaiting = lessons.filter(lesson => lesson.dateSubmitted && !lesson.dateEvaluated).length
        this.countEvaluated = lessons.filter(lesson => lesson.dateEvaluated).length
      })

    this.lessonService.list('?teacherId=' + this.securityContext.getUser().userId)
      .then(lessons => {
        const unevaluatedLessons = lessons.filter(lesson => !lesson.dateEvaluated && lesson.dateSubmitted)
        unevaluatedLessons.forEach(lesson => {
          this.userService.getById(lesson.studentId)
            .then(student => {
              if (this.evalStudents.filter(s => s.username === student.username).length === 0) {
                this.evalStudents.push(student)
              }
            })
          })
        })


    this.appointmentService.list('?teacherId=' + this.securityContext.getUser().userId)
      .then(apts => {
        apts.forEach(apt => {
          this.userService.getById(apt.studentId)
            .then(student => {
              apt.studentName = student.name
              this.teacherApts.push(apt)
            })
        })
      })

    this.appointmentService.list('?studentId=' + this.securityContext.getUser().userId)
      .then(apts => this.studentApts = apts)



  }

  changeTeacher() {
    this.profile.currentTeacherId = 'f85f363f-469d-44d5-bf85-3d3295b3c1b3'
    // this.profile.currentTeacherId = this.newTeacher.id
    this.profile.teacherConfirmed = false
    this.profileService.update(this.profile.id, this.profile)
      .then(() => this.$state.reload())
  }

  updateAvailability(){
    if (!this.profile.regularAvailability){
      this.profile.regularAvailability = null
    }
    if (!this.profile.otherAvailability){
      this.profile.otherAvailability = null
    }
    this.profileService.update(this.profile.id, this.profile)
      .then(() => this.updatedMessage = true)
  }

  acceptRequest(studentId) {
    this.profileService.list('?userId=' + studentId)
      .then(profile => {
        const studentProfile = profile[0]
        studentProfile.teacherConfirmed = true
        this.profileService.update(studentProfile.id, studentProfile)
          .then(() => this.$state.reload())
      })
  }

  declineRequest(studentId) {
    this.profileService.list('?userId=' + studentId)
      .then(profile => {
        const studentProfile = profile[0]
        studentProfile.currentTeacherId = null
        studentProfile.teacherConfirmed = null
        this.profileService.update(studentProfile.id, studentProfile)
          .then(() => this.$state.reload())
      })
  }

  requestAppointment(){
    this.appointment.teacherId = this.teacher.id
    this.appointment.studentId = this.securityContext.getUser().userId
    this.appointment.date = moment(this.aptDate).toISOString()
    this.appointmentService.createNew(this.appointment)
      .then(() => this.$state.reload())
  }

  cancelAppointment(appointment){
    appointment.status = 'cancelled'
    this.appointmentService.update(appointment.id, appointment)
      .then(() => this.$state.reload())
  }

  acceptAppointment(appointment) {
    appointment.status = 'accepted'
    this.appointmentService.update(appointment.id, appointment)
      .then(() => this.$state.reload())
  }

  declineAppointment(appointment) {
    appointment.status = 'declined'
    this.appointmentService.update(appointment.id, appointment)
      .then(() => this.$state.reload())
  }

}
