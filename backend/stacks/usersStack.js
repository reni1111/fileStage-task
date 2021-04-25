const cdk = require('@aws-cdk/core')
const cognito = require('@aws-cdk/aws-cognito')
const{ StringAttribute } = require('@aws-cdk/aws-cognito')
const lambda = require('@aws-cdk/aws-lambda')
const apiGateway = require('@aws-cdk/aws-apigateway')
const{ PolicyStatement, Effect } = require('@aws-cdk/aws-iam')
const sqs = require('@aws-cdk/aws-sqs')
const{ SqsEventSource } = require('@aws-cdk/aws-lambda-event-sources')

class UsersStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props)

    // COGNITO section
    const cognitoUserPool = new cognito.UserPool(this, 'fileStageUsers', {
      autoVerify: { email: true },
      mfa: cognito.Mfa.OFF,
      requiredAttributes: { email: true },
      selfSignUpEnabled: true,
      signInCaseSensitive: false,
      passwordPolicy: {
        minLength: 8,
      },
      signInAliases: {
        email: true,
      },
      userPoolName: 'fileStageUsers',
    })

    cognitoUserPool.node.defaultChild.accountRecoverySetting = { recoveryMechanisms: [{ name: 'verified_email', priority: 1 }, ] }


    // client is the app that will consume cognito (in our case our web application)
    const userPoolClient = new cognito.UserPoolClient(this, 'ReactClient', {
      userPool: cognitoUserPool,
      generateSecret: false,
      authFlows: { custom: true, refreshToken: true, userSrp: true },
      userPoolClientName: 'ReactClient',
    })

    userPoolClient.node.defaultChild.refreshTokenValidity = 30,

    this.cognitoUserPool = cognitoUserPool

  }
}

module.exports = { UsersStack }

