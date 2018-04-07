'use strict'

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './.todos',
    logging: false
})

//       Connexion à la BDD
sequelize.sync();
sequelize.authenticate().then(() => {
    // console.log('Connexion ok');
})
.catch(err =>{
    console.log('Connexion refusée', err);
});

//       Création de la table TODOS
const todos = sequelize.define('todos', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user: {
        type: Sequelize.STRING
    },
    message: {
        type: Sequelize.STRING
    },
    complete: {
        type: Sequelize.BOOLEAN
    }

});

module.exports = todos


