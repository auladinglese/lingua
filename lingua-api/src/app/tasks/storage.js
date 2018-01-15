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
      .then(function() {
        return task
      })
  }

  editTask(id, task){
    return this.taskCollection
      .update({ _id: id }, { "$set": task })
  }

  listTasks(filter) {
    return this.taskCollection
      .find()
      .toArray()
  }

  getTaskById(id) {
    return this.taskCollection
      .findOne({ _id: id})
  }

  deleteTask(id) {
    return this.taskCollection
      .deleteOne({ _id: id })
  }

}
