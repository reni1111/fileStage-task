



# FileStage - Feature 3

We will be building this infrastructure.

![infrastructure](https://order-message-queue.s3.eu-central-1.amazonaws.com/fwafwaf.png)

Tools used: 
1. AWS Cloud Development Kit - Cloud infrastructure using Javascript
2. Cognito - Authentication service
3. API Gateway - Managed by AWS
4. Lambda - Cloud functions
5. DynamoDb - Fast NoSQL for any scale
6. ReactJs

The whole application is implemented by the principle "Infrastructure as Code", so you just need an Amazon account to run these commands and the whole application would be hosted in your cloud:

1. Add to env your amazon access keys
2. Go to folder backend
3. run `npm install`  
4. `npm run deploy`
You are done :)

## Cloud Formation Stack
To implement the solution as Infrastructure as Code I used 3 stacks:
1. `DatabaseStack` 
2. `UsersStack`
3. `TodosStack`

 **Stack: `DatabaseStack`**
 -   Deploys DynamoDb table  `todos`, I have set the billing mode  `OnDemand`  so there will be no weird problems even if many people hit it.
 
  **Stack: `UsersStack`**
 -   Deploys a Cognito user pool, that will be used to handle all our users sign-up/sign-in/tokens, etc.
 - API Gateway has this user pool as an authorizer, so if you aren't a user of this user pool you won't be able to send requests.
 
 
**Stack: `TodosStack`**
- Deploys ApiGateway with all needed routes and connects them with each lambda

- Deploys 4 lambda: 
	- `createTodo` => will be used to create todo
	- `updateTodo` => in our app is used for the checkbox, but it is dynamic and can be used to update any attribute
	- 	`listTodos` =>  gets a limit in query paramaters and returns todos and nextToken
	- `deleteTodo` => will be used to delete todo

- Lambda is complied using Webpack because of the tree-shaking (small size=> small cold start), for more check the webpack config file.

## Service Collection
I already hosted the app in my AWS account, you can find service collection in [here](https://github.com/reni1111/fileStage-task/blob/master/frontEnd/src/service/Todo.service.js)
(maybe later I will add a postman collection)

## Automation tests:
We want to make sure that we don't break the system when we edit code, so it's time for automation testing.
I have used [mocha](https://www.npmjs.com/package/mocha) framework, tests can be found [here](https://github.com/reni1111/fileStage-task/blob/master/frontEnd/test/end2end.test.js).

To run the tests:
1. go to frontEnd folder
2. run `npm install`
3. run `npm run test`
Enjoy

Tests are done only for the API, if u want to know how I would test the Front-End... see you at the meeting.


## Front-End
I already hosted the app, you can try it [here](https://todo-filestage.web.app/).

I already explained this at the pdf document.



## Extra
The requirements were a little too easy, so it was hard to stand out...

I decided to go out of the box and not use the "Old Express"... so I went with the latest Serverless Technologies that can scale to infinity without any DevOps.