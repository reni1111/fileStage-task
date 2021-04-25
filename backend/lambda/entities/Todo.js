const{ generateId } = require('./../utils/generateId')
const{ generateUpdateExpression } = require('./../utils/generateUpdateExpression')

class Todo {
  constructor(userId, { id, ...todoData }={}) {
    this.userId = userId
    this.id = id ? id : generateId()

    this.todoData = todoData
  }

  key() {
    return{
      'PK': `User#${this.userId}#Todos`,
      'SK': `Todo#${this.id}`
    }
  }

  // for put
  toItem() {
    return{
      ...this.key(),
      id: this.id,
      userId: this.userId,
      EntityType: 'Todo',
      ...this.todoData
    }
  }

  // for update
  toUpdateItem(){
    if(Object.keys(this.todoData).length === 0)
      throw new Error('Update object should not be empty')

    return generateUpdateExpression(this.todoData)
  }
    
}

module.exports = {
  Todo
}