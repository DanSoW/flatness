import { genForeignKey } from "../../utils/db.js";

const Tapes = (sequelize, DataTypes) => {
    const model = sequelize.define('tapes', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    });

    model.associate = (models) => {
        model.hasMany(models.DataTapes, genForeignKey('tapes_id'));
        model.hasMany(models.ScreensTapes, genForeignKey('tapes_id'));
        model.belongsTo(models.Users, genForeignKey('users_id'));
    };

    return model;
};

export default Tapes;