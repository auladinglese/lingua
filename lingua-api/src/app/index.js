import 'babel-polyfill'
import * as restify from 'restify'
import { MongoClient } from 'mongodb'
import * as taskApi from './tasks/api'
import * as lessonApi from './lessons/api'
import * as userApi from './users/api'
import * as profileApi from './profiles/api'
import * as appointmentApi from './appointments/api'
import { MongoTaskStorage } from './tasks/storage'
import { MongoLessonStorage } from './lessons/storage'
import { MongoUserStorage } from './users/storage'
import { MongoProfileStorage } from './profiles/storage'
import { MongoAppointmentStorage } from './appointments/storage'
import restifyCorsMiddleware from 'restify-cors-middleware'
import { OAuthHooks }from './auth'
const restifyOauthServer = require('restify-oauth2')

const mongoUrl = 'mongodb://localhost:27017'
MongoClient.connect(mongoUrl, function(error, mongoClient) {
  const cors = restifyCorsMiddleware({
    origins: ['*'],
    allowHeaders: ['Authorization']
  })
  const server = restify.createServer()
  server.pre(cors.preflight)
  server.use(cors.actual)
  server.use(restify.plugins.bodyParser())
  server.use(restify.plugins.queryParser())
  server.use(restify.plugins.authorizationParser())

  const userStorage = new MongoUserStorage(mongoClient)

  const oauthHooks = new OAuthHooks(userStorage)
  restifyOauthServer.ropc(server, { tokenEndpoint: '/token', hooks: oauthHooks })

  taskApi.register(server, new MongoTaskStorage(mongoClient))
  lessonApi.register(server, new MongoLessonStorage(mongoClient))
  profileApi.register(server, new MongoProfileStorage(mongoClient))
  appointmentApi.register(server, new MongoAppointmentStorage(mongoClient))
  userApi.register(server, userStorage)

  server.listen(8888, () => {
    console.log('%s listening at %s', server.name, server.url);
  })
})
