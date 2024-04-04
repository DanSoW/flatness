import { genForeignKey } from "../../utils/db.js";

const DataUsers = (sequelize, DataTypes) => {
    const model = sequelize.define('data_users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        available_screens: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });

    model.associate = (models) => {
        model.belongsTo(models.Users, genForeignKey('users_id'));
    };

    return model;
};

export default DataUsers;