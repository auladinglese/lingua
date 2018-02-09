import { SecurityContext } from '../auth/SecurityContext'
import { UserService } from '../auth/UserService'
import { ProfileService } from './ProfileService'
import { LessonService } from '../lessons/LessonService'
import { AppointmentService } from './AppointmentService'
import moment from 'moment'


export class DashboardController {
  static $inject = ['SecurityContext', 'UserService', 'ProfileService', 'LessonService', 'AppointmentService']

  myStudents = []
  newStudents = []
  evalStudents = []
  assignStudents = []
  appointments = []
  updatedMessage = false


  constructor(securityContext, userService, profileService, lessonService, appointmentService) {
    this.securityContext = securityContext
    this.userService = userService
    this.profileService = profileService
    this.lessonService = lessonService
    this.appointmentService = appointmentService

    this.profileService.list('?userId=' + this.securityContext.getUser().userId)
      .then(profile => this.profile = profile[0])

    this.userService.list('?role=student')
      .then(students => {
        students.forEach(student => {
          this.profileService.list('?userId=' + student.id)
            .then(profile => {
              if(profile[0].currentTeacherId == this.securityContext.getUser().userId && profile[0].teacherConfirmed){
                this.myStudents.push(student)
                this.checkUnassignedLessons(student)
              } else if (profile[0].currentTeacherId == this.securityContext.getUser().userId && !profile[0].teacherConfirmed){
                this.newStudents.push(student)
              }
            })
        })
      })

    this.lessonService.list('?teacherId=' + this.securityContext.getUser().userId)
      .then(lessons => {
        const unevaluated = lessons.filter(lesson => !lesson.dateEvaluated && lesson.dateSubmitted)
        unevaluated.forEach(lesson => {
          this.userService.getById(lesson.studentId)
            .then(student => {
              if (!this.evalStudents.find(s => s.username == student.username)) {
                this.evalStudents.push(student)
              }
            })
          })
        })


    this.appointmentService.list('?teacherId=' + this.securityContext.getUser().userId)
      .then(appts => {
        const currentAppts = appts.filter(appt => moment(appt.date) > moment().subtract(1, 'days').endOf('day'))
        currentAppts.forEach(appt => {
          this.userService.getById(appt.studentId)
            .then(student => {
              appt.studentName = student.name
              this.appointments.push(appt)
            })
        })
      })

  }

  checkUnassignedLessons(student){
    this.lessonService.list('?studentId=' + student.id)
      .then(lessons => {
        const countAssigned = lessons.filter(lesson => !lesson || lesson.dateAssigned && !lesson.dateSubmitted).length
        const nameOnList = this.assignStudents.find(s => s.username == student.username)
        if (countAssigned == 0 && !nameOnList) {
          this.assignStudents.push(student)
        }
      })
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

  acceptRequest(student) {
    this.myStudents.push(student)
    this.newStudents.splice(this.newStudents.indexOf(student), 1)
    this.profileService.list('?userId=' + student.id)
      .then(profile => {
        const studentProfile = profile[0]
        studentProfile.teacherConfirmed = true
        this.profileService.update(studentProfile.id, studentProfile)
      })
  }

  declineRequest(student) {
    this.newStudents.splice(this.newStudents.indexOf(student), 1)
    this.updateStudentProfile(student.id)
    this.deleteStudentAppointments(student.id)
  }

  removeStudent(student){
    this.removeStudentWarning = true
    this.studentToRemove = student
  }

  removeStudentConfirmed() {
    this.removeStudentWarning = false
    this.myStudents.splice(this.myStudents.indexOf(this.studentToRemove), 1)
    this.updateStudentProfile(this.studentToRemove.id)
    this.deleteStudentAppointments(this.studentToRemove.id)
  }

  updateStudentProfile(id){
    this.profileService.list('?userId=' + id)
      .then(profile => {
        const studentProfile = profile[0]
        studentProfile.currentTeacherId = null
        studentProfile.teacherConfirmed = null
        this.profileService.update(studentProfile.id, studentProfile)
      })
  }

  deleteStudentAppointments(studentId){
    this.appointmentService.list('?studentId=' + studentId)
      .then(appointments => {
        appointments.forEach(appt => {
          this.appointments.splice(this.appointments.indexOf(appt), 1)
          this.appointmentService.delete(appt.id)
        })
      })
  }

  acceptAppointment(appointment) {
    appointment.status = 'accepted'
    this.appointmentService.update(appointment.id, appointment)
  }

  declineAppointment(appointment) {
    appointment.status = 'declined'
    this.appointmentService.update(appointment.id, appointment)
  }

  cancelAppointment(appointment){
    appointment.status = 'cancelled'
    this.appointmentService.update(appointment.id, appointment)
  }


}
