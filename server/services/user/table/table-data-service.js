import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import config from 'config';
import db from '../../../db/index.js';
import ApiError from '../../../exceptions/api-error.js';

/**
 * Контроллер для работы с таблицами
 */
class UserTableDataService {
    async tablesDataAdd(requestBody) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, row, tables_id } = requestBody;

            const table = await db.Tables.findOne({
                where: {
                    id: tables_id,
                    users_id: users_id
                }
            });

            if (!table) {
                throw ApiError.NotFound(`Таблицы с идентификатором ${tables_id} не найдено`);
            }

            const resText = await db.DataTables.create({
                users_id: users_id,
                tables_id: tables_id,
                row: row
            }, { transaction: t });

            await t.commit();

            return resText;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async tablesDataClearAll(requestBody) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                tables_id,
            } = requestBody;

            const table = await db.Tables.findOne({
                where: {
                    id: tables_id,
                    users_id: users_id
                }
            });

            if (!table) {
                throw ApiError.NotFound(`Таблицы с идентификатором ${tables_id} не найдено`);
            }

            const columns = await db.DataTables.findAll(({
                where: {
                    tables_id: tables_id,
                }
            }));

            // Очистка данных таблицы
            for (let i = 0; i < columns.length; i++) {
                await columns[i].destroy({ transaction: t });
            }

            await t.commit();

            return requestBody;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async tablesDataDelete(requestBody) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                data_tables_id,
                tables_id,
            } = requestBody;

            const table = await db.Tables.findOne({
                where: {
                    id: tables_id,
                    users_id: users_id
                }
            });

            if (!table) {
                throw ApiError.NotFound(`Таблицы с идентификатором ${tables_id} не найдено`);
            }

            const columns = await db.DataTables.findOne(({
                where: {
                    id: data_tables_id,
                    tables_id: tables_id,
                }
            }));

            if (!columns) {
                throw ApiError.NotFound(`Данных таблицы с идентификатором ${data_tables_id} не найдено`);
            }

            await columns.destroy({ transaction: t });
            await t.commit();

            return requestBody;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async tablesDataEdit(requestBody) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                tables_id,
                data_tables_id,
                row
            } = requestBody;

            const table = await db.Tables.findOne({
                where: {
                    id: tables_id,
                    users_id: users_id
                }
            });

            if (!table) {
                throw ApiError.NotFound(`Таблицы с идентификатором ${tables_id} не найдено`);
            }

            const resText = await db.DataTables.findOne(({
                where: {
                    id: data_tables_id,
                    users_id: users_id
                }
            }));

            if (!resText) {
                throw ApiError.NotFound(`Видео с идентификатором ${data_tables_id} не найдено`);
            }


            resText.row = row
            await resText.save({ transaction: t });

            await t.commit();

            return requestBody;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async tablesDataGet(requestBody) {
        try {
            const {
                data_tables_id,
                tables_id,
            } = requestBody;

            const dataTable = await db.DataTables.findOne(({
                where: {
                    id: data_tables_id,
                    tables_id
                }
            }));

            return dataTable;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async tablesDataGetAll(data) {
        try {
            const {
                tables_id
            } = data;

            const dataTables = await db.DataTables.findAll(({
                where: {
                    tables_id: tables_id
                },
                order: [['created_at', 'DESC']]
            }));

            return dataTables;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new UserTableDataService();