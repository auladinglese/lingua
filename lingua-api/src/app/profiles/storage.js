import uuid from 'uuid/v4'

function toModel(mongoObject) {
  if (!mongoObject) {
    return null
  }

  mongoObject.id = mongoObject._id
  delete mongoObject._id
  return mongoObject
}


export class MongoProfileStorage {
  constructor(mongoClient) {
    this.profileCollection = mongoClient.db('lingua')
      .collection('profiles')
  }

  saveNew(profile) {
    profile._id = uuid()
    return this.profileCollection.save(profile)
      .then(() => toModel(profile))
  }

  update(id, profile) {
    return this.profileCollection
      .update({ _id: id }, { "$set": profile })
  }

  getById(id) {
    return this.profileCollection
      .findOne({ _id: id })
      .then(toModel)
  }

  list(filter) {
    const mongoQuery = {}

    if(filter.userId){
      mongoQuery.userId = filter.userId
    }

    return this.profileCollection
      .find(mongoQuery)
      .map(toModel)
      .toArray()
  }

  delete(id) {
    return this.profileCollection
      .deleteOne({ _id: id })
  }
}
