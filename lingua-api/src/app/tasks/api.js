function taskToDto(task) {
  task.id = task._id
  delete task._id
  return task
}

export function manageTasks(server, taskStorage) {
  server.post('/task', function(req, resp, next) {
    taskStorage.saveTask(req.body)
      .then(function(task) {
        resp.status(201)
        resp.send(taskToDto(task))
        next()
      })
  })

  server.post('/task/:id', function(req, resp, next) {
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
