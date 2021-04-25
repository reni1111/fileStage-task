const{ DocumentClient } = require('aws-sdk/clients/dynamodb')
const dynamodb = new DocumentClient()

const{ errorKeys } = require('./../utils/errors')
// To consume this method use const {todo, error} = await createTodo(...)
// so you will have the power to handle the error by yourself

// todo is a class instance of entity : todo
const createTodo = async (todo) => {
  try{
    const todoItem = todo.toItem()
    await dynamodb.put({
      TableName: process.env['TodosTable'],
      Item: todoItem,
      ConditionExpression: 'attribute_not_exists(PK)',
    }).promise()
   
    const{ PK, SK, userId, ...rest } = todoItem
    return{
      todo: rest
    }
    
  } catch(error) {
    console.log('Error creating todo')
    console.log(error)
    let errorMessage = 'Could not create todo'

    if(error.code === 'ConditionalCheckFailedException') {
      errorMessage = errorKeys.TodoGeneralError
    }
    
    return{
      error: errorMessage
    }
  }
}

module.exports = {
  createTodo
}