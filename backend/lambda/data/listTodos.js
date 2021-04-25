const{ DocumentClient } = require('aws-sdk/clients/dynamodb')
const dynamodb = new DocumentClient()
const{ encode, decode } = require('./../utils/base64')

const listTodos = async (todo, options={}) => {
  try{
    const{ limit= 20, nextToken } = options

    let filterObj={
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': todo.key()['PK']
      }
    }

    if(nextToken){
      filterObj.ExclusiveStartKey = decode(nextToken)
    }
    if(limit){
      filterObj.Limit= limit
    }

    const response = await dynamodb.query({
      TableName: process.env['TodosTable'],
      ProjectionExpression: 'id, #text, completed',
      ...filterObj,
      ExpressionAttributeNames: {
        // reserved word
        '#text': 'text'
      }
    }).promise()

    return{
      todos: response.Items,
      nextToken: encode(response.LastEvaluatedKey)
    }
  } catch(error) {
    console.log(error)
    return{
      error: 'Could not get todos'
    }
  }
}

module.exports = {
  listTodos
}