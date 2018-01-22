const apiEndpoint = 'http://localhost:8888/'

export class LessonService {
  static $inject = ['$http']

  constructor($http){
    this.$http = $http
  }

  list(){
    return this.$http({
      method: 'GET',
      url: `${apiEndpoint}lessons`
    }).then(response => response.data)
  }

  getById(id){
    return this.$http({
      method: 'GET',
      url: `${apiEndpoint}lesson/` + id
    }).then(response => response.data)
  }

  createNew(lesson){
    return this.$http({
      method: 'POST',
      url: `${apiEndpoint}lesson`,
      data: lesson
    }).then(response => response.data)
  }

  update(id, lesson){
    return this.$http({
      method: 'POST',
      url: `${apiEndpoint}lesson/` + id,
      data: lesson
    })
  }

  delete(id){
    return this.$http({
      method: 'DELETE',
      url: `${apiEndpoint}lesson/` + id
    })
  }

}
