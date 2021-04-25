import{ useState, useEffect } from'react'
import{ makeStyles } from'@material-ui/core/styles'
import{
  Container,
  Typography,
  Button,
  Icon,
  Paper,
  Box,
  TextField,
  Checkbox,
} from'@material-ui/core'
import InfiniteScroll from'react-infinite-scroller'

import todoService from'./../service/Todo.service'

const useStyles = makeStyles({
  addTodoContainer: { padding: 10 },
  addTodoButton: { marginLeft: 5 },
  todosContainer: { marginTop: 10, padding: 10 },
  todoContainer: {
    borderTop: '1px solid #bfbfbf',
    marginTop: 5,
    '&:first-child': {
      margin: 0,
      borderTop: 'none',
    },
    '&:hover': {
      '& $deleteTodo': {
        visibility: 'visible',
      },
    },
  },
  todoTextCompleted: {
    textDecoration: 'line-through',
  },
  deleteTodo: {
    visibility: 'hidden',
  },
})

function Todos() {
  const classes = useStyles()
  const[todos, setTodos] = useState([])
  const[nextToken, setNextToken]= useState(null)
  const[newTodoText, setNewTodoText] = useState('')

  async function getTodosList(limit, nextToken){
    const listTodos = await todoService.getTodos(limit, nextToken)
    console.log(listTodos)
    setTodos([...todos, ...listTodos.todos])
    setNextToken(listTodos.nextToken)
  }

  useEffect(() => {
    getTodosList()
  }, [setTodos])

  async function addTodo(text) {
    const todo= await todoService.addTodo(text)
    console.log(todo)
    setTodos([...todos, todo])
    setNewTodoText('')
  }

  async function toggleTodoCompleted(id) {
    await todoService.toggleTodo(id, !todos.find((todo) => todo.id === id).completed)
    const newTodos = [...todos]
    const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id)
    newTodos[modifiedTodoIndex] = {
      ...newTodos[modifiedTodoIndex],
      completed: !newTodos[modifiedTodoIndex].completed,
    }
    setTodos(newTodos)
  }

  async function deleteTodo(id) {
    await todoService.deleteTodo(id)
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return(
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Todos
      </Typography>
      <Paper className={classes.addTodoContainer}>
        <Box display="flex" flexDirection="row">
          <Box flexGrow={1}>
            <TextField
              fullWidth
              value={newTodoText}
              onKeyPress={(event) => {
                if(event.key === 'Enter') {
                  addTodo(newTodoText)
                }
              }}
              onChange={(event) => setNewTodoText(event.target.value)}
            />
          </Box>
          <Button
            className={classes.addTodoButton}
            startIcon={<Icon>add</Icon>}
            onClick={() => addTodo(newTodoText)}
          >
            Add
          </Button>
        </Box>
      </Paper>
      {todos.length > 0 && 
      (
        <InfiniteScroll
          pageStart={0}
          loadMore={()=>{getTodosList(20, nextToken)}}
          hasMore={nextToken}
          loader={<div className="loader" key={0}>Loading ...</div>}
        >
          <Paper className={classes.todosContainer}>
            <Box display="flex" flexDirection="column" alignItems="stretch">
              {todos.map(({ id, text, completed }) => (
                <Box
                  key={id}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  className={classes.todoContainer}
                >
                  <Checkbox
                    checked={completed}
                    onChange={() => toggleTodoCompleted(id)}
                  ></Checkbox>
                  <Box flexGrow={1}>
                    <Typography
                      className={completed ? classes.todoTextCompleted : ''}
                      variant="body1"
                    >
                      {text}
                    </Typography>
                  </Box>
                  <Button
                    className={classes.deleteTodo}
                    startIcon={<Icon>delete</Icon>}
                    onClick={() => deleteTodo(id)}
                  >
                  Delete
                  </Button>
                </Box>
              ))}
            </Box>
          </Paper>
        </InfiniteScroll>
      )
      }
    </Container>
  )
}

export default Todos
