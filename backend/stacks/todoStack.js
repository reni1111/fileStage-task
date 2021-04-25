const cdk = require('@aws-cdk/core')
const lambda = require('@aws-cdk/aws-lambda')
const apiGateway = require('@aws-cdk/aws-apigateway')
const{ WebpackFunction } = require('aws-cdk-webpack-lambda-function')

class TodosStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props)

    const createTodo = new WebpackFunction(this, 'createTodo', {
      runtime: lambda.Runtime.NODEJS_12_X,
      entry: 'lambda/handler/createTodoHandler.js',
      config: 'webpack.config.js',
      functionName: 'createTodo',
    })

    const updateTodo = new WebpackFunction(this, 'updateTodo', {
      runtime: lambda.Runtime.NODEJS_12_X,
      entry: 'lambda/handler/updateTodoHandler.js',
      config: 'webpack.config.js',
      functionName: 'updateTodo',
    })

    const listTodos = new WebpackFunction(this, 'listTodos', {
      runtime: lambda.Runtime.NODEJS_12_X,
      entry: 'lambda/handler/listTodosHandler.js',
      config: 'webpack.config.js',
      functionName: 'listTodos',
    })


    const deleteTodo = new WebpackFunction(this, 'deleteTodo', {
      runtime: lambda.Runtime.NODEJS_12_X,
      entry: 'lambda/handler/deleteTodoHandler.js',
      config: 'webpack.config.js',
      functionName: 'deleteTodo',
    })

    const lambdas =[
      createTodo,
      updateTodo,
      listTodos,
      deleteTodo
    ]
    
    lambdas.map(lambda=> {
      lambda.addEnvironment('TodosTable', props.todosTable.tableName)
      props.todosTable.grantReadWriteData(lambda)
    })

    // API GATEWAY section
    const api = new apiGateway.RestApi(this, 'todos-api', {
      // allow cors
      defaultCorsPreflightOptions: {
        allowOrigins: apiGateway.Cors.ALL_ORIGINS,
        allowMethods: apiGateway.Cors.ALL_METHODS
      }
    })

    // setting cognito as authorizer for api gateway
    const auth = new apiGateway.CfnAuthorizer(this, 'APIGatewayAuthorizer', {
      name: 'user-authorizer',
      identitySource: 'method.request.header.Authorization',
      providerArns: [props.cognitoUserPool.userPoolArn],
      restApiId: api.restApiId,
      type: apiGateway.AuthorizationType.COGNITO,
    })
    
    // creates the route
    const routeWithId = api.root.addResource('{id}')

    // method get
    const listTodosIntegration = new apiGateway.LambdaIntegration(listTodos)
    const createTodoIntegration = new apiGateway.LambdaIntegration(createTodo)
    const updateTodoIntegration = new apiGateway.LambdaIntegration(updateTodo)
    const deleteTodoIntegration = new apiGateway.LambdaIntegration(deleteTodo)

    api.root.addMethod('GET', listTodosIntegration, {
      authorizationType: apiGateway.AuthorizationType.COGNITO,
      authorizer: { authorizerId: auth.ref },
    })
    api.root.addMethod('POST', createTodoIntegration, {
      authorizationType: apiGateway.AuthorizationType.COGNITO,
      authorizer: { authorizerId: auth.ref },
    })
    routeWithId.addMethod('PUT', updateTodoIntegration, {
      authorizationType: apiGateway.AuthorizationType.COGNITO,
      authorizer: { authorizerId: auth.ref },
    })
    routeWithId.addMethod('DELETE', deleteTodoIntegration, {
      authorizationType: apiGateway.AuthorizationType.COGNITO,
      authorizer: { authorizerId: auth.ref },
    })
  }
}

module.exports = { TodosStack }

