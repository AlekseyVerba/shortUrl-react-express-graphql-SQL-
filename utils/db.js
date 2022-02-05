const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const createSequelize = new Sequelize('fullstak', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
  });

module.exports = createSequelize