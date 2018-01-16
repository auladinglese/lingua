import uuid from 'uuid/v4'
// import moment from 'moment'

export class MongoTaskStorage {
  constructor(mongoClient) {
    this.taskCollection = mongoClient.db('lingua')
      .collection('tasks')
  }

  saveTask(task) {
    task._id = uuid()
    return this.taskCollection.save(task)
      .then(() => task)
  }

  editTask(id, task) {
    return this.taskCollection
      .update({ _id: id }, { "$set": task })
  }

  getTaskById(id) {
    return this.taskCollection
      .findOne({ _id: id })
  }

  deleteTask(id) {
    return this.taskCollection
      .deleteOne({ _id: id })
  }

  // { '$or': [ { level: 'Advanced' }, { level: 'Beginner' } ] }
  createMultiValueFilter(mongoQuery, filter, attribute){
    let multiFilter = []
    for (let i=0; i<filter.length; i++){
      multiFilter.push({ [attribute]: filter[i] })
    }
    return multiFilter
  }

  //tasks?teacherId=1&level=beginner&category=grammar&subject=food&name=smth
  listTasks(filter) {
    const mongoQuery = {}

    if(filter.teacherId){
      mongoQuery.teacher = filter.teacherId
    }

    if(Array.isArray(filter.level)){
      mongoQuery.$or = this.createMultiValueFilter(mongoQuery, filter.level, 'level')
    } else if(filter.level){
      mongoQuery.level = filter.level
    }

    if(Array.isArray(filter.category) && mongoQuery.$or){
      for (let i=0; i<mongoQuery.$or.length; i++){
        mongoQuery.$or[i].$or = this.createMultiValueFilter(mongoQuery, filter.category, 'category')
      }
    } else if(Array.isArray(filter.category) && !mongoQuery.$or){
      mongoQuery.$or = this.createMultiValueFilter(mongoQuery, filter.category, 'category')
    } else if(filter.category){
      mongoQuery.category = filter.category
    }

    if(filter.subject){
      mongoQuery.subject = new RegExp('.*' + filter.subject + '.*', 'i')
    }

    if(filter.name){
      mongoQuery.name = new RegExp('.*' + filter.name + '.*', 'i')
    }

    return this.taskCollection
      .find(mongoQuery)
      .toArray()
  }
}
