'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Helper function to recursively read model files
function readModelsRecursively(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      readModelsRecursively(fullPath);
    } else if (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    ) {
      const model = require(fullPath)(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    }
  });
}

// Start scanning from current directory (models/)
readModelsRecursively(__dirname);

// Call associate if exists
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

/*if (db.User && db.Mentor && db.Grouping) {
  db.User.belongsToMany(db.Mentor, { through: db.Grouping, foreignKey: 'userId' });
  db.Mentor.belongsToMany(db.User, { through: db.Grouping, foreignKey: 'mentorId' });
}*/

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
