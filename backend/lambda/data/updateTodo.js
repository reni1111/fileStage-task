const{ DocumentClient } = require('aws-sdk/clients/dynamodb')
const dynamodb = new DocumentClient()

const{ errorKeys } = require('./../utils/errors')

// To consume this method use const {todo, error} = await updateTodo(...)
// so you will have the power to handle the error by yourself

// todo is a class instance of entity : todo
const updateTodo = async (todo) => {
  try{
    
    await dynamodb.update({
      TableName: process.env['TodosTable'],
      Key: todo.key(),
      ConditionExpression: 'attribute_exists(PK)',
      ...todo.toUpdateItem(),
    }).promise()

    return{
      todo: todo.toItem()
    }
    
  } catch(error) {
    console.log('Error updating todo')
    console.log(error)
    let errorMessage = 'Could not update todo'

    if(error.code === 'ConditionalCheckFailedException') {
    // it means the item doesn't exist (depending on the ues case, we may return item doesn't exist)
      errorMessage = errorKeys.TodoGeneralError
    }
   
    return{
      error: errorMessage
    }
  }
}

module.exports = {
  updateTodo
}