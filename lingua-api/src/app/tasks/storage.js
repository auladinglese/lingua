import uuid from 'uuid/v4'

function toModel(mongoObject) {
  if (!mongoObject) {
    return null
  }

  mongoObject.id = mongoObject._id
  delete mongoObject._id
  return mongoObject
}


export class MongoTaskStorage {
  constructor(mongoClient) {
    this.taskCollection = mongoClient.db('lingua')
      .collection('tasks')
  }

  saveNew(task) {
    task._id = uuid()
    return this.taskCollection.save(task)
      .then(() => toModel(task))
  }

  update(id, task) {
    return this.taskCollection
      .update({ _id: id }, { "$set": task })
  }

  getById(id) {
    return this.taskCollection
      .findOne({ _id: id })
      .then(toModel)
  }

  delete(id) {
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
  list(filter) {
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
      .map(toModel)
      .toArray()
  }
}
