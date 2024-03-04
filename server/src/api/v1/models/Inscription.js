const { Model, DataTypes } = require("sequelize");

class Inscription extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: DataTypes.INTEGER,
        dates: DataTypes.DATE,
        code: DataTypes.STRING,
        location: DataTypes.STRING, // get the name of city. ex: mardid
        latitude: DataTypes.STRING,
        longitude: DataTypes.STRING,
        device: DataTypes.STRING,
        ip_address: DataTypes.STRING,
        operating_system: DataTypes.STRING,
        navigator: DataTypes.STRING,
        status: DataTypes.INTEGER,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "inscriptions",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Organization, {
      foreignKey: "organization_id",
      as: "inscription_organization",
      allowNull: false,
    });
  }
}
module.exports = Inscription;
