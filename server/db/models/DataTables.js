import { genForeignKey } from "../../utils/db.js";

const DataTables = (sequelize, DataTypes) => {
    const model = sequelize.define('data_tables', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        row: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    });

    model.associate = (models) => {
        model.belongsTo(models.Tables, genForeignKey('tables_id'));
    };

    return model;
};

export default DataTables;