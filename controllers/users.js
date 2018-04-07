'use strict'

const users = require('../models/users')
const crypt = require('bcrypt')


exports.addUser = function(p_user, p_password)
{
    const hashPass = crypt.hashSync(p_password, 10)
    return users.create({
        name: p_user,
        password: hashPass
    })
}

exports.delUser = function(p_id)
{
    return users.destroy({
        where: 
        {
            id: p_id
        }
    })
}

exports.authenticate = async function(p_user, p_password)
{
    const user = await users.find({
        where: {
            name: p_user
        }
    })
    if(user == null) { return false }

    if(crypt.compare(p_password, user.password))
    {
        return true
    }
    else
    {
        return false
    }
}

exports.clearUsers = function()
{
    return users.drop()
}

exports.printAllUsers = function()
{
    return users.findAll().then((res) => {
        for(let i = 0; i < res.length; i++)
        {
            console.log(res[i].id + ' | ' + res[i].name + ' | ' + res[i].password)
        }
    })
}

