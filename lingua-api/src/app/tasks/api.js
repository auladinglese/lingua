import Joi from 'joi'
import { validate } from '../validation'
import { mustAuthenticate } from '../auth'

const taskSchema = Joi.object().keys({
    teacherId: Joi.string().required(),
    studentId: Joi.string().allow(null),
    dateWorked: Joi.date().iso(),
    completed: Joi.boolean(),
    evaluated: Joi.boolean(),
    level: Joi.string().required(),
    category: Joi.string().required(),
    subject: Joi.string().required(),
    name: Joi.string().required(),
    instructions: Joi.string().allow(''),
    source: Joi.string(),
    sourceType: Joi.string(),
    questions: Joi.array().items(Joi.object().keys({
      question: Joi.string().required(),
      type: Joi.string().required(),
      answers: Joi.array().items(Joi.string()),
      studentAnswer: Joi.alternatives([Joi.string(), Joi.object()]),
      evaluation: Joi.string(),
      evalComments: Joi.string()
    })).required()
})

export function register(server, storage) {
  server.post('/task', mustAuthenticate(), validate(taskSchema), function(req, resp, next) {
    storage.saveNew(req.body)
      .then(function(task) {
        resp.status(201)
        resp.header('Location', '/task/' + task.id)
        resp.send(task)
        next()
      })
  })

  server.post('/task/:id', mustAuthenticate(), validate(taskSchema), function(req, resp, next) {
    storage.update(req.params.id, req.body)
      .then(function() {
        return storage.getById(req.params.id)
      })
      .then(function(task) {
        if (!task) {
          resp.status(404)
          resp.send({
            message: 'Task with id ' + req.params.id + ' was not found'
          })
        } else {
          resp.send(task)
        }
        next()
      })
  })

  server.get('/tasks', mustAuthenticate(), function(req, resp, next) {
    storage.list(req.query)
      .then(function(tasks) {
        resp.send(tasks)
        next()
      })
  })

  server.get('/task/:id', mustAuthenticate(), function(req, resp, next) {
    storage.getById(req.params.id)
      .then(function(task) {
        if (!task) {
          resp.status(404)
          resp.send({
            message: 'Task with id ' + req.params.id + ' was not found'
          })
        } else {
          resp.send(task)
        }
        next()
      })
  })

  server.del('/task/:id', mustAuthenticate(), function(req, resp, next) {
    storage.delete(req.params.id)
      .then(() => {
        resp.status(204)
        resp.end()
        next()
      })
  })

}
