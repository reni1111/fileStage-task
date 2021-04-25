const axios = require('axios')
const{ Auth } = require('aws-amplify')

axios.defaults.baseURL = 'https://8sq28opdh8.execute-api.eu-central-1.amazonaws.com/prod'

axios.interceptors.request.use(async request => {
  const session = await Auth.currentSession()  
  request.headers.Authorization = session.getIdToken().getJwtToken()
  return request
}, error => {
  console.log(error)
  return Promise.reject(error)
})

async function getTodos(limit= 20, nextToken){
  const params = { limit, nextToken }
 
  const listTodosRes = await axios.get('/', {
    headers: {
      'Content-Type': 'application/json'
    },
    params
  })
  return listTodosRes.data
}

async function addTodo(text) {
  const todoRes = await axios.post('/', {
    text
  }, {
    headers: {
      'Content-Type': 'application/json'
    },
  })
  return todoRes.data
}

async function toggleTodo(id, completed) {
  const todoRes = await axios.put(`/${id}`, {
    completed
  }, {
    headers: {
      'Content-Type': 'application/json'
    },
  })
  return todoRes.data

}

async function deleteTodo(id) {
  const todoRes =await axios.delete(`/${id}`, {
    headers: {
      'Content-Type': 'application/json'
    },
  })

  return todoRes.data
}

const todoService = {
  addTodo,
  toggleTodo,
  getTodos,
  deleteTodo
}

module.exports = todoService