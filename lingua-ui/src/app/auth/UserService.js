const apiEndpoint = 'http://localhost:8888/'

export class UserService {
  static $inject = ['$http']

  constructor($http){
    this.$http = $http
  }

  list(filter = '?'){
    return this.$http({
      method: 'GET',
      url: `${apiEndpoint}users` + filter
    }).then(response => response.data)
  }

  getById(id){
    return this.$http({
      method: 'GET',
      url: `${apiEndpoint}user/` + id
    }).then(response => response.data)
  }

  createNew(user){
    return this.$http({
      method: 'POST',
      url: `${apiEndpoint}user`,
      data: user
    }).then(response => response.data)
  }

  update(id, user){
    return this.$http({
      method: 'POST',
      url: `${apiEndpoint}user/` + id,
      data: user
    })
  }

  delete(id){
    return this.$http({
      method: 'DELETE',
      url: `${apiEndpoint}user/` + id
    })
  }

}
