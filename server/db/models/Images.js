import { genForeignKey } from "../../utils/db.js";

const Images = (sequelize, DataTypes) => {
    const model = sequelize.define('images', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        filename: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        filepath: {
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
    };

    return model;
};

export default Images;