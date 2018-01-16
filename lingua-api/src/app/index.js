import * as restify from 'restify'
import { MongoClient } from 'mongodb'
import * as taskApi from './tasks/api'
import { MongoTaskStorage } from './tasks/storage'
import restifyCorsMiddleware from 'restify-cors-middleware'

var mongoUrl = 'mongodb://localhost:27017'
MongoClient.connect(mongoUrl, function(error, mongoClient) {
  const cors = restifyCorsMiddleware({
    origins: ['*']
  })
  const server = restify.createServer()
  server.pre(cors.preflight)
  server.use(cors.actual)
  server.use(restify.plugins.bodyParser())
  server.use(restify.plugins.queryParser())

  taskApi.manageTasks(server, new MongoTaskStorage(mongoClient))

  server.listen(8888, () => {
    console.log('%s listening at %s', server.name, server.url);
  })
})
