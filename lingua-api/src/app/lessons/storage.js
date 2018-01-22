import uuid from 'uuid/v4'

function toModel(mongoObject) {
  if (!mongoObject) {
    return null
  }

  mongoObject.id = mongoObject._id
  delete mongoObject._id
  return mongoObject
}


export class MongoLessonStorage {
  constructor(mongoClient) {
    this.lessonCollection = mongoClient.db('lingua')
      .collection('lessons')
  }

  saveNew(lesson) {
    lesson._id = uuid()
    return this.lessonCollection.save(lesson)
      .then(() => toModel(lesson))
  }

  update(id, lesson) {
    return this.lessonCollection
      .update({ _id: id }, { "$set": lesson })
  }

  getById(id) {
    return this.lessonCollection
      .findOne({ _id: id })
      .then(toModel)
  }

  list() {
    return this.lessonCollection
      .find({})
      .map(toModel)
      .toArray()
  }

  delete(id) {
    return this.lessonCollection
      .deleteOne({ _id: id })
  }
}
