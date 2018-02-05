import Joi from 'joi'
import { validate } from '../validation'
import { mustAuthenticate } from '../auth'


const profileSchema = Joi.object().keys({
    userId: Joi.string().required(),
    currentTeacherId: Joi.string().allow(null),
    teacherConfirmed: Joi.boolean().allow(null),
    regularAvailability: Joi.string().allow(null),
    otherAvailability: Joi.string().allow(null)
})

export function register(server, storage) {
  server.post('/profile', mustAuthenticate(), validate(profileSchema), function(req, resp, next) {
    storage.saveNew(req.body)
      .then(function(profile) {
        resp.status(201)
        resp.header('Location', '/profile/' + profile.id)
        resp.send(profile)
        next()
      })
  })

  server.post('/profile/:id', mustAuthenticate(), validate(profileSchema), function(req, resp, next) {
    storage.update(req.params.id, req.body)
      .then(function() {
        return storage.getById(req.params.id)
      })
      .then(function(profile) {
        if (!profile) {
          resp.status(404)
          resp.send({
            message: 'profile with id ' + req.params.id + ' was not found'
          })
        } else {
          resp.send(profile)
        }
        next()
      })
  })

  server.get('/profiles', mustAuthenticate(), function(req, resp, next) {
    storage.list(req.query)
      .then(function(profiles) {
        resp.send(profiles)
        next()
      })
  })

  server.get('/profile/:id', mustAuthenticate(), function(req, resp, next) {
    storage.getById(req.params.id)
      .then(function(profile) {
        if (!profile) {
          resp.status(404)
          resp.send({
            message: 'profile with id ' + req.params.id + ' was not found'
          })
        } else {
          resp.send(profile)
        }
        next()
      })
  })

  server.del('/profile/:id', mustAuthenticate(), function(req, resp, next) {
    storage.delete(req.params.id)
      .then(() => {
        resp.status(204)
        resp.end()
        next()
      })
  })

}
