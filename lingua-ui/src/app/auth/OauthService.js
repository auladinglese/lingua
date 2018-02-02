const apiEndpoint = 'http://localhost:8888/'

function encodeFormData(obj) {
  return Object.keys(obj)
    .map(key => `${key}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

export class OauthService {
  static $inject = ['$http']

  constructor($http) {
    this.$http = $http
  }

  getToken(clientId, clientSecret, username, password) {
    return this.$http ({
      method: 'POST',
      url: apiEndpoint + 'token',
      headers: {
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: encodeFormData,
      data: {
        grant_type: 'password',
        username,
        password
      }
    }).then(resp => resp.data)
  }
}
