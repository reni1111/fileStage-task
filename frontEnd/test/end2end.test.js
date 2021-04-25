// amplify needs this for auth on node environment
global.fetch = require('node-fetch')
const Amplify = require('aws-amplify')
const{ Auth } = require('aws-amplify')
const{ v4: uuid } = require('uuid')
const MailosaurClient = require('mailosaur')
const assert = require('chai').assert
const expect = require('chai').expect
const amplifyConfig = require('./../src/config/cognito.json')
const todoService = require('./../src/service/Todo.service')

const DEFAULT_PASSWORD = '123123?!'
const EMAIL_SECRET = 'va4bipkmqI85gDKf'
const EMAIL_SERVER = 'ba1oaokx'
const emailClient = new MailosaurClient(EMAIL_SECRET)
Amplify.default.configure(amplifyConfig)

describe('FileStage', function () {
  const users = [
    {
      email: `users0${uuid()}.${EMAIL_SERVER}@mailosaur.io`
    },
  ]

  let todos =[
    {
      text: 'Make pdf for fileStage'
    },
    {
      text: 'Make a scalable solution for fileStage'
    }
  ]

  it('User 0 signUp', async function () {
    let user = await userSignUp(users[0].email)
  })

  it('User 0 signIn', async function () {
    let user = await userSignIn(users[0].email)
  })

  it('Get Todos should return 0 items', async function () {
    const todosRes = await todoService.getTodos()
    expect(todosRes.todos).to.have.length(0)
    expect(todosRes.nextToken).to.equal(null)
  })

  it('Add Todo', async function () {
    const todosRes = await todoService.addTodo(todos[0].text)
    expect(todosRes).to.have.all.keys('id', 'text', 'EntityType')
    todos[0].id = todosRes.id
  })

  it('Get Todos should return 1 item', async function () {
    const todosRes = await todoService.getTodos()
    expect(todosRes.todos).to.have.length(1)
    expect(todosRes.todos[0].text).equal(todos[0].text)  
  })

  it('Update Todo', async function () {
    const todoRes = await todoService.toggleTodo(todos[0].id, true)
    expect(todoRes.completed).equal(true)
  })

  it('Delete Todo', async function () {
    await todoService.deleteTodo(todos[0].id)
  })

  it('Get Todos should return 0 item', async function () {
    const todosRes = await todoService.getTodos()
    expect(todosRes.todos).to.have.length(0)
  })

})


async function getVerificationCode(email) {
  // waits up to 20seconds for email (amazon takes about 1-3seconds)
  const message = await emailClient.messages.get(EMAIL_SERVER, {
    sentTo: email
  })
  const verificationCode = message.html.body.replace('The verification code to your new account is ', '')
  console.log('verification code', verificationCode)
  return verificationCode
}

async function userSignUp(email) {
  try{
    let user = await Auth.signUp({
      username: email,
      password: DEFAULT_PASSWORD,
    })

    const code = await getVerificationCode(email)

    await Auth.confirmSignUp(email, code)
  } catch(err) {
    console.log('signUp err', err)
  }
}

async function userSignIn(email) {
  try{
    await Auth.signIn({
      username: email,
      password: DEFAULT_PASSWORD
    })
  } catch(err) {
    console.log('signUp err', err)
  }
}