'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Produto.hasMany(models.Tag);
    }
  }
  Produto.init({
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    preco: DataTypes.DECIMAL,
    foto: DataTypes.STRING,
    promocao: DataTypes.BOOLEAN,
    precoPromocao: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Produto',
  });
  return Produto;
};