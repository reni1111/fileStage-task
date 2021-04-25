const{ updateTodo } = require('../data/updateTodo')
const{ Todo } = require('../entities/Todo')
const{ ErrorWrapper } = require('..//utils/errorWrapper')
const{ responseMapper } = require('./../utils/responseMapper')

module.exports.handler = async (event, context, callback ) => {
  try{
    console.log(JSON.stringify(event))

    const userId = event.requestContext.authorizer.claims.sub

    const todoData = JSON.parse(event.body)
    const id = event.pathParameters.id

    const todoInstance = new Todo(userId, { id, ...todoData } )

    const{ todo, error } = await updateTodo(todoInstance)
    
    if(error)
      throw new Error(error)

    return responseMapper(200, todo)
  } catch(err){
    console.log(err)
    return ErrorWrapper(err)
  }
}