const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        prename: DataTypes.STRING,
        name: DataTypes.STRING,
        gender: DataTypes.STRING,
        telephone: DataTypes.STRING,
        mail: DataTypes.STRING,
        birth: DataTypes.STRING,
        birth_location: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        thumbnails: DataTypes.STRING,
        is_completed: DataTypes.BOOLEAN,
        sys_role: DataTypes.STRING,
        status: DataTypes.INTEGER,
        updated_at: DataTypes.DATE,
      },
      {
        sequelize,
        freezeTableName: true,
        tableName: "users",
        hooks: {
          beforeCreate: (user) => {
            const salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(user.password, salt);
          },
          beforeUpdate: (user) => {
            if (user.password) {
              const salt = bcrypt.genSaltSync();
              user.password = bcrypt.hashSync(user.password, salt);
            }
          },
        },
      }
    );
  }
  static associate(models) {
    this.hasMany(models.Inscription, {
      foreignKey: "user_id",
      as: "user_inscription",
      allowNull: false,
    });
    this.hasMany(models.Document, {
      foreignKey: "user_id",
      as: "user_document",
      allowNull: false,
    });
    this.hasMany(models.Contract, {
      foreignKey: "user_id",
      as: "user_contract",
      allowNull: false,
    });
    this.hasMany(models.Signer, {
      foreignKey: "user_id",
      as: "user_signer",
      allowNull: false,
    });
    this.hasMany(models.Login, {
      foreignKey: "user_id",
      as: "user_login",
      allowNull: false,
    });
  }
}
module.exports = User;
