const apiEndpoint = 'http://localhost:8888/'

export class TaskService {
  static $inject = ['$http']

  constructor($http){
    this.$http = $http
  }

  list(filter = '?'){
    return this.$http({
      method: 'GET',
      url: `${apiEndpoint}tasks` + filter
    }).then(response => response.data)
  }

  getById(id){
    return this.$http({
      method: 'GET',
      url: `${apiEndpoint}task/` + id
    }).then(response => response.data)
  }

  createNew(task){
    return this.$http({
      method: 'POST',
      url: `${apiEndpoint}task`,
      data: task
    }).then(response => response.data)
  }

  editTask(id, task){
    return this.$http({
      method: 'POST',
      url: `${apiEndpoint}task/` + id,
      data: task
    })
  }

  delete(id){
    return this.$http({
      method: 'DELETE',
      url: `${apiEndpoint}task/` + id
    })
  }

}
