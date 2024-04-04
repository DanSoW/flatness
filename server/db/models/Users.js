import { genForeignKey } from "../../utils/db.js";

const Users = (sequelize, DataTypes) => {
    const model = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        email: {
            type: DataTypes.TEXT,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    model.associate = (models) => {
        model.hasMany(models.UsersRoles, genForeignKey('users_id'));
        model.hasMany(models.Roles, genForeignKey('users_id', true));
        model.hasMany(models.Tokens, genForeignKey('users_id'));
        model.hasMany(models.Screens, genForeignKey('users_id'));
        model.hasMany(models.Texts, genForeignKey('users_id'));
        model.hasMany(models.Videos, genForeignKey('users_id'));
        model.hasMany(models.Tables, genForeignKey('users_id'));
        model.hasMany(models.Images, genForeignKey('users_id'));
        model.hasMany(models.Tapes, genForeignKey('users_id'));
        model.hasMany(models.DataUsers, genForeignKey('users_id'));
    }

    return model;
};

export default Users;