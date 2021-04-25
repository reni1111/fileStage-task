const cdk = require('@aws-cdk/core')
const{ UsersStack } = require('../stacks/usersStack')
const{ DatabaseStack } =  require('../stacks/databaseStack')
const{ TodosStack } = require('../stacks/todoStack')
const app = new cdk.App()

const databaseStack = new DatabaseStack(app, 'fileStageDatabaseStack')

const usersStack = new UsersStack(app, 'fileStageUsersStack')

const todosStack = new TodosStack(app, 'fileStageTodosStack', {
  cognitoUserPool: usersStack.cognitoUserPool,
  todosTable: databaseStack.todosTable
})
