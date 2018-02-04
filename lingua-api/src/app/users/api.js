import Joi from 'joi'
import { validate } from '../validation'

const userSchema = Joi.object().keys({
    name: Joi.string().required(),
    username: Joi.string().alphanum().required(),
    password: Joi.string().required(),
    claims: Joi.array().items(
        Joi.object().keys({
            name: Joi.string().required(),
            value: Joi.string().required(),
        }).required()
    ).required()
})

export function register(server, storage) {
  server.post('/user', validate(userSchema), function(req, resp, next) {
    storage.saveNew(req.body)
      .then(function(user) {
        resp.status(201)
        resp.header('Location', '/user/' + user.id)
        resp.send(user)
        next()
      })
  })

  server.post('/user/:id', validate(userSchema), function(req, resp, next) {
    storage.update(req.params.id, req.body)
      .then(function() {
        return storage.getById(req.params.id)
      })
      .then(function(user) {
        if (!user) {
          resp.status(404)
          resp.send({
            message: 'User with id ' + req.params.id + ' was not found'
          })
        } else {
          resp.send(user)
        }
        next()
      })
  })

  server.get('/users', function(req, resp, next) {
    storage.list(req.query)
      .then(function(users) {
        resp.send(users)
        next()
      })
  })

  server.get('/user/:id', function(req, resp, next) {
    storage.getById(req.params.id)
      .then(function(user) {
        if (!user) {
          resp.status(404)
          resp.send({
            message: 'User with id ' + req.params.id + ' was not found'
          })
        } else {
          resp.send(user)
        }
        next()
      })
  })

  server.del('/user/:id', function(req, resp, next) {
    storage.delete(req.params.id)
      .then(() => {
        resp.status(204)
        resp.end()
        next()
      })
  })

}
