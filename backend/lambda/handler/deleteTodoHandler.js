const{ deleteTodo } = require('../data/deleteTodo')
const{ Todo } = require('../entities/Todo')
const{ ErrorWrapper } = require('../utils/errorWrapper')
const{ responseMapper } = require('./../utils/responseMapper')

module.exports.handler = async (event, context, callback ) => {
  try{
    console.log(JSON.stringify(event))

    const userId = event.requestContext.authorizer.claims.sub

    const id = event.pathParameters.id
  
    const newTodoInstance = new Todo(userId, { id } )

    const{ deletedTodo, error } = await deleteTodo(newTodoInstance)
    
    if(error)
      throw new Error(error)

    return responseMapper(200, deletedTodo)

  } catch(err){
    console.log(err)
    return ErrorWrapper(err)
  }
}