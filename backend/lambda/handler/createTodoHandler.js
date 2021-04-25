const{ createTodo } = require('../data/createTodo')
const{ Todo } = require('../entities/Todo')
const{ ErrorWrapper } = require('../utils/errorWrapper')
const{ responseMapper } = require('./../utils/responseMapper')

module.exports.handler = async (event, context, callback ) => {
  try{
    console.log(JSON.stringify(event))
    const userId = event.requestContext.authorizer.claims.sub

    const todoData = JSON.parse(event.body)

    const newTodo = new Todo(userId, todoData )

    const{ todo, error } = await createTodo(newTodo)
    
    if(error)
      throw new Error(error)
    
    console.log(todo)

    return responseMapper(200, todo)

  } catch(err){
    console.log(err)
    return ErrorWrapper(err)
  }
}