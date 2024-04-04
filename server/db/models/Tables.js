import { genForeignKey } from "../../utils/db.js";

const Tables = (sequelize, DataTypes) => {
    const model = sequelize.define('tables', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        columns: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        delay: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    model.associate = (models) => {
        model.belongsTo(models.Users, genForeignKey('users_id'));
        model.hasMany(models.DataTables, genForeignKey('tables_id'));
    };

    return model;
};

export default Tables;