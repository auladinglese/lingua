function taskToDto(task) {
    task.id = task._id
    delete task._id
    return task
}

export function manageTasks(server, taskStorage){
  server.post('/task', function(req, resp, next){
    taskStorage.saveTask(req.body)
    .then(function(task){
      resp.status(201)
      resp.send(taskToDto(task))
      next()
    })
  })


}
