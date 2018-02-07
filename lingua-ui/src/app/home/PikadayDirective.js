import moment from 'moment'
import Pikaday from 'pikaday'

export function datepicker() {
  return {
    restrict: 'A',
    link: (scope, el) => {
      new Pikaday({
        field: el[0],
        format: "D MMM YYYY",
        firstDay: 1,
        minDate: moment().toDate(),
      })
    }
  }
}
