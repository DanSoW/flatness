import { genForeignKey } from "../../utils/db.js";

const Screens = (sequelize, DataTypes) => {
    const model = sequelize.define('screens', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        link: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    });

    model.associate = (models) => {
        model.belongsTo(models.Users, genForeignKey('users_id'));
        model.hasMany(models.ScreensTapes, genForeignKey('screens_id'));
    };

    return model;
};

export default Screens;