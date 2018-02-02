import uuid from 'uuid/v4'
import { hash, verify } from '../hash'

function toModel(mongoObject) {
  if (!mongoObject) {
    return null
  }

  mongoObject.id = mongoObject._id
  delete mongoObject._id
  return mongoObject
}

async function toMongoObject(id, user) {
  return {
    _id: id,
    name: user.name,
    login: user.login,
    password: user.password ? await hash(user.password) : undefined,
    claims: user.claims
  }
}

export class MongoUserStorage {
  constructor(mongoClient) {
    this.userCollection = mongoClient.db('lingua')
      .collection('users')
  }

  async verifyCredentials(username, password) {
    const user = await this.userCollection
      .findOne({ login: username })
    if (!user) {
      return null
    }

    const passwordMatches = await verify(user.password, password)
    if (!passwordMatches) {
      return null
    }

    return toModel(user)
  }

  async saveNew(user) {
    const saved = await toMongoObject(uuid(), user)

    await this.userCollection.save(saved)
    return toModel(saved)
  }
  // saveNew(user) {
  //   user._id = uuid()
  //   return this.userCollection.save(user)
  //     .then(() => toModel(user))
  // }

  // update(id, user) {
  //   return this.userCollection
  //     .update({ _id: id }, { "$set": user })
  // }
  async update(id, user) {
    const saved = await toMongoObject(id, user)

    const update = {
      '$set': saved
    }

    return this.userCollection
      .update({ _id: id }, update)
}

  getById(id) {
    return this.userCollection
      .findOne({ _id: id })
      .then(toModel)
  }

  list(filter) {
    const mongoQuery = {}

    if(filter.username){
      mongoQuery.login = filter.username
    }

    if(filter.role){
      const key = "claims.value"
      mongoQuery[key] = filter.role
    }

    return this.userCollection
      .find(mongoQuery)
      .map(toModel)
      .toArray()
  }

  delete(id) {
    return this.userCollection
      .deleteOne({ _id: id })
  }
}
