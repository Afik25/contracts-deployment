const { Model, DataTypes } = require("sequelize");

class Contract extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: DataTypes.INTEGER,
        title: DataTypes.STRING, // function title
        type: DataTypes.STRING, // type of contract (EM: employees or ST: student)
        thumbnails: DataTypes.STRING, // function title
        annotations: DataTypes.TEXT, // function title
        // updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "contracts",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "contract_user",
      allowNull: false,
    });
    this.hasMany(models.Signer, {
      foreignKey: "contract_id",
      as: "contract_signer",
      allowNull: false,
    });
  }
}

module.exports = Contract;
