var Sequelize = require('sequelize');
// var model = require('../config/connection.js');

module.exports = function(sequelize, DataTypes) {

var burger = sequelize.define("burger", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    burger_name: {
        type: Sequelize.STRING,
    },

    devoured: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },
    createdAt:{
        type:Sequelize.DATE,
    },
    updatedAt:{
        type:Sequelize.DATE,
    }
});

// sequelizeBurger.sync();
return burger;
}