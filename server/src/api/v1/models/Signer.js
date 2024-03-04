const { Model, DataTypes } = require("sequelize");

class Signer extends Model {
  static init(sequelize) {
    super.init(
      {
        contract_id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        type: DataTypes.STRING, // destination or in cc
        order: DataTypes.STRING, // function title
        status: DataTypes.INTEGER,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "signers",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "signer_user",
      allowNull: false,
    });
    this.belongsTo(models.Contract, {
      foreignKey: "contract_id",
      as: "signer_contract",
      allowNull: false,
    });
  }
}

module.exports = Signer;
