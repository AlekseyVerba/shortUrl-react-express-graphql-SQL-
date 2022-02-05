const Sequelize = require("sequelize")
const createSequelize = require("../utils/db")

const PasswordToken = createSequelize.define("Link", {
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
    from: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
    }, 
    to: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    code: {
        allowNull: false,
        type: Sequelize.STRING,
    },
    clicks: {
        defaultValue: 0,
        type: Sequelize.INTEGER
    },
    shortDescription: {
        type: Sequelize.STRING
    }
})

module.exports = PasswordToken