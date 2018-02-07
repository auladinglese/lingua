const apiEndpoint = 'http://localhost:8888/'

export class AppointmentService {
  static $inject = ['$http']

  constructor($http){
    this.$http = $http
  }

  list(filter = '?'){
    return this.$http({
      method: 'GET',
      url: `${apiEndpoint}appointments` + filter
    }).then(response => response.data)
  }

  getById(id){
    return this.$http({
      method: 'GET',
      url: `${apiEndpoint}appointment/` + id
    }).then(response => response.data)
  }

  createNew(appointment){
    return this.$http({
      method: 'POST',
      url: `${apiEndpoint}appointment`,
      data: appointment
    }).then(response => response.data)
  }

  update(id, appointment){
    return this.$http({
      method: 'POST',
      url: `${apiEndpoint}appointment/` + id,
      data: appointment
    })
  }

  delete(id){
    return this.$http({
      method: 'DELETE',
      url: `${apiEndpoint}appointment/` + id
    })
  }

}
