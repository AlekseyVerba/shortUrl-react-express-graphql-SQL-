const Sequelize = require("sequelize")
const createSequelize = require("../utils/db")

const User = createSequelize.define("User", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: true
    },
    birthday: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tokenHash: {
        type: Sequelize.STRING,
    },
    isConfirm: {
        type: Sequelize.BOOLEAN
    },
    imgUser: {
        type: Sequelize.STRING
    }

})

module.exports = User