const apiEndpoint = 'http://localhost:8888/'

export class ProfileService {
  static $inject = ['$http']

  constructor($http){
    this.$http = $http
  }

  list(filter = '?'){
    return this.$http({
      method: 'GET',
      url: `${apiEndpoint}profiles` + filter
    }).then(response => response.data)
  }

  getById(id){
    return this.$http({
      method: 'GET',
      url: `${apiEndpoint}profile/` + id
    }).then(response => response.data)
  }

  createNew(profile){
    return this.$http({
      method: 'POST',
      url: `${apiEndpoint}profile`,
      data: profile
    }).then(response => response.data)
  }

  update(id, profile){
    return this.$http({
      method: 'POST',
      url: `${apiEndpoint}profile/` + id,
      data: profile
    })
  }

  delete(id){
    return this.$http({
      method: 'DELETE',
      url: `${apiEndpoint}profile/` + id
    })
  }

}
