import Joi from 'joi'
import { validate } from './validation'

function taskToDto(task) {
  task.id = task._id
  delete task._id
  return task
}

const taskSchema = Joi.object().keys({
    teacherId: Joi.string().required(),
    studentId: Joi.string(),
    dateAssigned: Joi.date().iso(),
    dateCompleted: Joi.date().iso(),
    level: Joi.string().allow(null),
    category: Joi.string().allow(null),
    subject: Joi.string(),
    name: Joi.string(),
    instructions: Joi.string(),
    source: Joi.string(),
    sourceType: Joi.string(),
    questions: Joi.array().items(Joi.object().keys({
      question: Joi.string().required(),
      maxScore: Joi.number(),
      type: Joi.string().required(),
      answers: Joi.array().items(Joi.string()),
      studentAnswer: Joi.alternatives([Joi.string(), Joi.object()])
    })).required()
})

export function manageTasks(server, taskStorage) {
  server.post('/task', validate(taskSchema), function(req, resp, next) {
    taskStorage.saveTask(req.body)
      .then(function(task) {
        resp.status(201)
        resp.header('Location', '/task/' + task._id)
        resp.send(taskToDto(task))
        next()
      })
  })

  server.post('/task/:id', validate(taskSchema), function(req, resp, next) {
    taskStorage.editTask(req.params.id, req.body)
      .then(function() {
        return taskStorage.getTaskById(req.params.id)
      })
      .then(function(task) {
        if (!task) {
          resp.status(404)
          resp.send({
            message: 'Task with id ' + req.params.id + ' was not found'
          })
        } else {
          resp.send(taskToDto(task))
        }
        next()
      })
  })

  server.get('/tasks', function(req, resp, next) {
    taskStorage.listTasks(req.query)
      .then(function(tasks) {
        resp.send(tasks.map(taskToDto))
        next()
      })
  })

  server.get('/task/:id', function(req, resp, next) {
    taskStorage.getTaskById(req.params.id)
      .then(function(task) {
        if (!task) {
          resp.status(404)
          resp.send({
            message: 'Task with id ' + req.params.id + ' was not found'
          })
        } else {
          resp.send(taskToDto(task))
        }
        next()
      })
  })

  server.del('/task/:id', function(req, resp, next) {
    taskStorage.deleteTask(req.params.id)
      .then(() => {
        resp.status(204)
        resp.end()
        next()
      })
  })

}
