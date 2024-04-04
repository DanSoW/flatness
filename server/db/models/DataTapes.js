import { genForeignKey } from "../../utils/db.js";

const DataTapes = (sequelize, DataTypes) => {
    const model = sequelize.define('data_tapes', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        data_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        table_name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        queue_num: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

    model.associate = (models) => {
        model.belongsTo(models.Tapes, genForeignKey('tapes_id'));
    };

    return model;
};

export default DataTapes;