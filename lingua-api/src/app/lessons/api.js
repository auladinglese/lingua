import Joi from 'joi'
import { validate } from '../validation'

const lessonSchema = Joi.object().keys({
    teacherId: Joi.string().required(),
    studentId: Joi.string().allow(null),
    dateAssigned: Joi.date().iso().allow(null),
    dateSubmitted: Joi.date().iso(),
    dateMarked: Joi.date().iso(),
    tasks: Joi.array().items(Joi.string()).required()
})

export function register(server, storage) {
  server.post('/lesson', validate(lessonSchema), function(req, resp, next) {
    storage.saveNew(req.body)
      .then(function(lesson) {
        resp.status(201)
        resp.header('Location', '/lesson/' + lesson._id)
        resp.send(lesson)
        next()
      })
  })

  server.post('/lesson/:id', validate(lessonSchema), function(req, resp, next) {
    storage.update(req.params.id, req.body)
      .then(function() {
        return storage.getById(req.params.id)
      })
      .then(function(lesson) {
        if (!lesson) {
          resp.status(404)
          resp.send({
            message: 'Lesson with id ' + req.params.id + ' was not found'
          })
        } else {
          resp.send(lesson)
        }
        next()
      })
  })

  server.get('/lessons', function(req, resp, next) {
    storage.list()
      .then(function(lessons) {
        resp.send(lessons)
        next()
      })
  })

  server.get('/lesson/:id', function(req, resp, next) {
    storage.getById(req.params.id)
      .then(function(lesson) {
        if (!lesson) {
          resp.status(404)
          resp.send({
            message: 'Lesson with id ' + req.params.id + ' was not found'
          })
        } else {
          resp.send(lesson)
        }
        next()
      })
  })

  server.del('/lesson/:id', function(req, resp, next) {
    storage.delete(req.params.id)
      .then(() => {
        resp.status(204)
        resp.end()
        next()
      })
  })

}
