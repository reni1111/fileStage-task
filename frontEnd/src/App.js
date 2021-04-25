import React from'react'
import Amplify from'aws-amplify'
import{ Authenticator, } from'aws-amplify-react'
import Todos from'./Todos'
import cognitoConfig from'./config/cognito.json'

Amplify.configure(cognitoConfig)

function App() {

  return(
    <>
      <Authenticator
        usernameAttributes="email"
        signUpConfig={{
          hiddenDefaults: ['phone_number'],
        }}
      >
        <Todos />
      </Authenticator>
    </>
  )
}

export default App