const{ DocumentClient } = require('aws-sdk/clients/dynamodb')
const dynamodb = new DocumentClient()

const{ errorKeys } = require('./../utils/errors')

// we need to check no item contains this todo and then delete
// if items exists => don't delete

const deleteTodo = async (todo) => {
  try{
    const deletedTodoObj = await dynamodb.delete({
      TableName: process.env['TodosTable'],
      Key: todo.key(),
      ReturnValues: 'ALL_OLD',
      ConditionExpression: 'attribute_exists(PK)',
    }).promise()

    const{ PK, SK, userId, ...rest } = deletedTodoObj.Attributes
    return{
      deletedTodo: rest
    }
  } catch(error) {
    console.log(error)
    let errorMessage = 'Could not delete todo'

    if(error.code === 'ConditionalCheckFailedException') {
      errorMessage = errorKeys.TodoGeneralError
    }

    return{
      error: errorMessage
    }
  }
}

module.exports = {
  deleteTodo
}