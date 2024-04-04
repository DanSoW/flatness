import { genForeignKey } from "../../utils/db.js";

const Videos = (sequelize, DataTypes) => {
    const model = sequelize.define('videos', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        link: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        audio: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    });

    model.associate = (models) => {
        model.belongsTo(models.Users, genForeignKey('users_id'));
    };

    return model;
};

export default Videos;