import uuid from 'uuid/v4'

function toModel(mongoObject) {
  if (!mongoObject) {
    return null
  }

  mongoObject.id = mongoObject._id
  delete mongoObject._id
  return mongoObject
}


export class MongoAppointmentStorage {
  constructor(mongoClient) {
    this.appointmentCollection = mongoClient.db('lingua')
      .collection('appointments')
  }

  saveNew(appointment) {
    appointment._id = uuid()
    return this.appointmentCollection.save(appointment)
      .then(() => toModel(appointment))
  }

  update(id, appointment) {
    return this.appointmentCollection
      .update({ _id: id }, { "$set": appointment })
  }

  getById(id) {
    return this.appointmentCollection
      .findOne({ _id: id })
      .then(toModel)
  }

  list(filter) {
    const mongoQuery = {}

    if(filter.studentId){
      mongoQuery.studentId = filter.studentId
    }

    if(filter.teacherId){
      mongoQuery.teacherId = filter.teacherId
    }
    
    return this.appointmentCollection
      .find(mongoQuery)
      .map(toModel)
      .toArray()
  }

  delete(id) {
    return this.appointmentCollection
      .deleteOne({ _id: id })
  }
}
