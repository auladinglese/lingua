import moment from 'moment'
import Pikaday from 'pikaday'

export function datepicker() {
  return {
    restrict: 'A',
    link: (scope, el, attrs) => {
      const picker = new Pikaday({
        field: el[0],
        format: "D MMM YYYY",
        firstDay: 1,
        minDate: moment().toDate(),
        keyboardInput: true,
        onOpen: () => {
          if (!scope.dashStu.apptDate){
            picker.setDate()
          }
        },
        onSelect: () => {
          const pickerDate = moment(picker.getDate()).toISOString()
          if (scope.dashStu.appointment.date && scope.dashStu.appointment.date !== pickerDate){
            scope.dashStu.appointment.date = moment(picker.getDate()).toISOString()
            scope.$apply()
          }
        }
      })

      scope.$watch(() => scope.dashStu.appointment, (newValue, oldValue)=> {
        if (newValue.date && !oldValue.date) {
          picker.setDate(newValue.date)
        }
      }, true)
    }
  }
}
