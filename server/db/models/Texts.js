import { genForeignKey } from "../../utils/db.js";

const Texts = (sequelize, DataTypes) => {
    const model = sequelize.define('texts', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        text: {
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

export default Texts;