import uuid from 'uuid/v4'
import moment from 'moment'

export class MongoTaskStorage {
  constructor(mongoClient) {
    this.taskCollection = mongoClient.db('ahoy')
      .collection('tasks')
  }

  saveTask(task) {
    task._id = uuid()
    return this.taskCollection.save(task)
      .then(function() {
        return task
      })
  }

}
