const{ listTodos } = require('../data/listTodos')
const{ Todo } = require('../entities/Todo')
const{ ErrorWrapper } = require('../utils/errorWrapper')
const{ responseMapper } = require('./../utils/responseMapper')

module.exports.handler = async (event, context, callback ) => {
  try{
    console.log(JSON.stringify(event))

    const userId = event.requestContext.authorizer.claims.sub

    const listTodosOptions = event.queryStringParameters

    const todoInstance = new Todo(userId)

    const{ todos, nextToken, error } = await listTodos(todoInstance, listTodosOptions)
    
    if(error)
      throw new Error(error)

    let response = {
      todos,
      nextToken
    }

    return responseMapper(200, response)
    
  } catch(err){
    console.log(err)
    return ErrorWrapper(err)
  }
}