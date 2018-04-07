'use strict'

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: './.users',
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

//       Création de la table USERS

const users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
});

module.exports = users

