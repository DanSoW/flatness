import { genForeignKey } from "../../utils/db.js";

const ScreensTapes = (sequelize, DataTypes) => {
    const model = sequelize.define('screens_tapes', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        }
    });

    model.associate = (models) => {
        model.belongsTo(models.Screens, genForeignKey('screens_id'));
        model.belongsTo(models.Tapes, genForeignKey('tapes_id'));
    };

    return model;
};

export default ScreensTapes;