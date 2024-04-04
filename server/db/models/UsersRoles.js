import { genForeignKey } from "../../utils/db.js";

const UsersRoles = (sequelize, DataTypes) => {
    const model = sequelize.define('users_roles', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
    });

    model.associate = (models) => {
        model.belongsTo(models.Users, genForeignKey('users_id'));
        model.belongsTo(models.Roles, genForeignKey('roles_id'));
    }

    return model;
};

export default UsersRoles;