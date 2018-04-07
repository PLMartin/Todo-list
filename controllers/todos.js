'use strict'

const todos = require('../models/todos')

exports.addTodo = function(p_user, p_message)
{
    return todos.create({
        user: p_user,
        message: p_message,
        complete: false
    })
}

exports.delTodo = function(p_id)
{
    return todos.destroy({
        where: 
        {
            id: p_id
        }
    })
}

exports.clearTodos = function()
{
    return todos.drop()
}

exports.getTodo = async function(p_id)
{
    const todo = await todos.find({
        where: {
          id: p_id
        }
    })
    return todo
}

exports.getAllTodosByUser = async function(p_user)
{
    const res = await todos.findAll({
        order: [['complete', 'ASC']],
        where: {
          'user': p_user
        }
    })
    return res
}

exports.getAllTodos = async function()
{
    const data = await todos.findAll()
    return data
}

exports.completeTodo = function(p_id)
{
    return todos.update({'complete': true}, { where : { 'id': p_id }})
}