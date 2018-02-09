import Joi from 'joi'
import { validate } from '../validation'
import { mustAuthenticate } from '../auth'


const appointmentSchema = Joi.object().keys({
    teacherId: Joi.string().required(),
    studentId: Joi.string().required(),
    date: Joi.date().iso().required(),
    time: Joi.string().required(),
    duration: Joi.string().required(),
    status: Joi.string(),
    message: Joi.string(),
    reply: Joi.string()
})

export function register(server, storage) {
  server.post('/appointment', mustAuthenticate(), validate(appointmentSchema), function(req, resp, next) {
    storage.saveNew(req.body)
      .then(function(appointment) {
        resp.status(201)
        resp.header('Location', '/appointment/' + appointment.id)
        resp.send(appointment)
        next()
      })
  })

  server.post('/appointment/:id', mustAuthenticate(), validate(appointmentSchema), function(req, resp, next) {
    storage.update(req.params.id, req.body)
      .then(function() {
        return storage.getById(req.params.id)
      })
      .then(function(appointment) {
        if (!appointment) {
          resp.status(404)
          resp.send({
            message: 'Appointment with id ' + req.params.id + ' was not found'
          })
        } else {
          resp.send(appointment)
        }
        next()
      })
  })

  server.get('/appointments', mustAuthenticate(), function(req, resp, next) {
    storage.list(req.query)
      .then(function(appointments) {
        resp.send(appointments)
        next()
      })
  })

  server.get('/appointment/:id', mustAuthenticate(), function(req, resp, next) {
    storage.getById(req.params.id)
      .then(function(appointment) {
        if (!appointment) {
          resp.status(404)
          resp.send({
            message: 'Appointment with id ' + req.params.id + ' was not found'
          })
        } else {
          resp.send(appointment)
        }
        next()
      })
  })

  server.del('/appointment/:id', mustAuthenticate(), function(req, resp, next) {
    storage.delete(req.params.id)
      .then(() => {
        resp.status(204)
        resp.end()
        next()
      })
  })

}
