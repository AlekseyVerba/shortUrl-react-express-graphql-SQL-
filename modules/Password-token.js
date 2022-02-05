const Sequelize = require("sequelize")
const createSequelize = require("../utils/db")

const PasswordToken = createSequelize.define("PasswordToken", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    idUser: {
        allowNull: false,
        type: Sequelize.INTEGER
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

module.exports = PasswordToken