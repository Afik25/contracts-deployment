const { Model, DataTypes } = require("sequelize");

class Document extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: DataTypes.INTEGER,
        title: DataTypes.STRING, // function title
        thumbnails: DataTypes.STRING, // the name of the file rennamed
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "documents",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "document_user",
      allowNull: false,
    });
  }
}

module.exports = Document;
