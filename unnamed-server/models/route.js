'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Route.belongsTo(models.User, {
      //   foreignKey: 'user_id',
      //   allowNull: false
      // })
    }
  }
  Route.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
    from: { type: DataTypes.GEOMETRY('POINT') },
    to: { type: DataTypes.GEOMETRY('POINT') },
    route: { type: DataTypes.GEOMETRY('LINESTRING') }
  }, {
    sequelize,
    modelName: 'Route',
    tableName: 'routes'
  });
  return Route;
};