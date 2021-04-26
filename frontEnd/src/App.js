import React from'react'
import Amplify from'aws-amplify'
import{ Authenticator, withAuthenticator } from'aws-amplify-react'
import Todos from'./Todos'
import cognitoConfig from'./config/cognito.json'

Amplify.configure(cognitoConfig)

function App() {
  return(
    <Todos />
  )
}

export default withAuthenticator(App, {
  usernameAttributes: 'email',
  signUpConfig: {
    hiddenDefaults: ['phone_number'],
  }
})