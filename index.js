'use strict'

const express = require('express')
const app = express()
const users = require('./controllers/users')
const todos = require('./controllers/todos')
const bodyParser = require('body-parser')
const session = require('express-session')
const methodOverride = require('method-override')


app.use(session({secret: 'secret'}))

app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

app.set('views', './views')
app.set('view engine', 'ejs')

app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }))

app.all('/', (req, res) => {
    res.render('login')
})

app.post('/users/authenticate', async (req, res) => {
    const authenticateOK = await users.authenticate(req.body.user, req.body.password)
    if(authenticateOK)
    {
        req.session.user = req.body.user
        res.redirect('/todos')
    }
    else { res.redirect('/') }
    
})

app.get('/users/new', (req, res) => {
    res.render('user')
})

app.post('/users', (req, res) => {
    users.addUser(req.body.user, req.body.password)    
    res.redirect('/')
})

app.get('/todos', async(req, res) => {
    if(!req.session.user) { res.redirect('/') }
    else
    {
        const todoList = await todos.getAllTodosByUser(req.session.user)

        res.format({
            html: () => { res.render('index', { 'list': todoList })},
            json: () => { res.json(todoList) }
        })
    }
})

app.get('/todos/add', (req, res) => {
    res.render('edit')
})

app.get('/todos/:todoID', async (req, res) => {
    if(!req.session.user) { res.redirect('/') }
    let todo = await todos.getTodo(req.params.todoID)

    if (todo && (req.session.user == todo.user))
    {
        res.render("show", {
            user: todo.user,
            message: todo.message,
            complete: todo.complete
        })
    }
    else
    {
        res.send("Error 404 : Not found")
    }
})
  
app.post('/todos', (req, res) => {
    let todo = todos.addTodo(req.body.user, req.body.message)
    res.format({
        html: () => res.redirect('/todos'),
        json: () => res.json(todo)
    })
})

app.patch('/todos/:todoID', (req, res) => {
    let todo = todos.completeTodo(req.params.todoID)
    res.format({
        html: () => res.redirect('/todos'),
        json: () => res.json(todo)
    })
})

app.delete('/todos/:todoID', (req, res) => {
    let todo = todos.delTodo(req.params.todoID)
    res.format({
        html: () => res.redirect('/todos'),
        json: () => {
            if(todo) { res.json(todo) }
            else {  res.status(404).json({error: "Unknown todo"}) }
        }
    })
})


const server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Todos list app listening at http://%s:%s', host, port)
})
