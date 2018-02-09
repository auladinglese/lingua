import { SecurityContext } from '../auth/SecurityContext'
import { UserService } from '../auth/UserService'
import { ProfileService } from './ProfileService'
import { LessonService } from '../lessons/LessonService'
import { AppointmentService } from './AppointmentService'
import moment from 'moment'


export class DashboardStudentController {
  static $inject = ['SecurityContext', 'UserService', 'ProfileService', 'LessonService', 'AppointmentService']


  times = ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30']
  durations = ['15 min', '30 min', '1 h', '1.5 h', '2 h']
  requestSentMessage = false
  dateInvalidMessage = false
  appointments = []
  appointment = {}

  constructor(securityContext, userService, profileService, lessonService, appointmentService) {
    this.securityContext = securityContext
    this.userService = userService
    this.profileService = profileService
    this.lessonService = lessonService
    this.appointmentService = appointmentService

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

    this.appointmentService.list('?studentId=' + this.securityContext.getUser().userId)
      .then(appts => {
        this.appointments = appts.filter(appt => moment(appt.date) > moment().subtract(1, 'days').endOf('day'))
      })


  }

  getTeacherProfile(){
    this.profileService.list('?userId=' + this.profile.currentTeacherId)
      .then(teacherProfile => this.teacherProfile = teacherProfile[0])
  }

  changeTeacher() {
    this.profile.currentTeacherId = this.newTeacher.id
    this.profile.teacherConfirmed = false
    this.profileService.update(this.profile.id, this.profile)
    this.teacher = this.newTeacher
    this.getTeacherProfile()
    this.deleteAppointments()
  }

  deleteAppointments(){
    if (this.appointments){
      this.appointments.forEach(appt => {
        this.appointmentService.delete(appt.id)
      })
      this.appointments = []
    }
  }

  requestAppointment(){
    if (moment(this.apptDate).isValid()) {
      this.appointment.date = moment(this.apptDate).toISOString()
    } else {
      this.dateInvalidMessage = true
      return
    }

    if (this.appointment.id){
      this.appointmentService.update(this.appointment.id, this.appointment)
      .then(() => this.clearRequestForm())
    } else {
      this.appointment.teacherId = this.teacher.id
      this.appointment.studentId = this.securityContext.getUser().userId
      this.appointmentService.createNew(this.appointment)
        .then((appt) => {
          this.appointments.push(appt)
          this.clearRequestForm()
        })
    }
  }

  amendRequest(appointment){
    this.appointment = appointment
  }

  clearRequestForm(){
    this.appointment = {}
    this.apptDate = null
    this.requestSentMessage = true
  }

}
