import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import config from 'config';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import db from '../../db/index.js';
import tokenService from '../token/token-service.js';
import jwtService from '../token/jwt-service.js';
import ApiError from '../../exceptions/api-error.js';
import SuccessDto from '../../dtos/response/success-dto.js';
import RefreshDto from '../../dtos/auth/refresh-dto.js';
import RoleDto from '../../dtos/auth/role-dto.js';
import mailService from '../mail/mail-service.js';
import MailerForms from '../../constants/forms/mailer-forms.js';
import fs from 'fs';
import TABLE_NAMES from '../../constants/tables/table-names.js';
import { nanoid } from 'nanoid';
import { where } from 'sequelize';

/**
 * Контроллер для работы с экранами
 */
class UserScreenService {
    async screensAdd(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, title } = data;

            const dataUser = await db.DataUsers.findOne({
                where: {
                    users_id: users_id
                }
            });

            if (!dataUser) {
                throw ApiError.NotFound(`Пользователя с идентификатором ${users_id} не найдено (данные)`);
            }

            // Проверка нет ли создания экранов большего, чем заданное число
            if (dataUser.available_screens > 0) {
                const screens = await db.Screens.findAll({
                    where: {
                        users_id: users_id
                    }
                });

                if ((screens.length + 1) > dataUser.available_screens) {
                    throw ApiError.BadRequest(`Нельзя иметь экранов больше, чем ${dataUser.available_screens}`);
                }
            }

            // Генерация ссылки для ленты
            const link = nanoid(config.get("nanoid.size"));

            const screen = await db.Screens.create({
                users_id: users_id,
                title: title,
                link: link,
            }, { transaction: t });

            await t.commit();

            return screen;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async screenDelete(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                screens_id,
            } = data;

            const screens = await db.Screens.findOne({
                where: {
                    id: screens_id,
                    users_id: users_id,
                }
            });

            if (!screens) {
                throw ApiError.NotFound(`Экрана с идентификатором ${screens_id} не найдено`);
            }

            const screenTapes = await db.ScreensTapes.findAll({
                where: {
                    screens_id: screens.id
                }
            });

            for (let i = 0; i < screenTapes.length; i++) {
                const screenTape = screenTapes[i];

                const tape = await db.Screens.findOne({
                    where: {
                        id: screenTape.tapes_id
                    }
                });

                if (tape) {
                    const dataTapes = await db.DataTapes.findAll({
                        where: {
                            tapes_id: tape.id
                        }
                    });

                    // Удаление данных ленты
                    for (let i = 0; i < dataTapes.length; i++) {
                        await dataTapes[i].destroy({ transaction: t });
                    }

                    // Удаление ленты
                    await tape.destroy({ transaction: t });
                }

                // Удаление связи между лентой и экраном
                await screenTape.destroy({ transaction: t });
            }

            // Удаление экрана
            await screens.destroy({ transaction: t });
            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async screenEdit(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                screens_id,
                title,
            } = data;

            const screen = await db.Screens.findOne(({
                where: {
                    id: screens_id,
                    users_id: users_id
                }
            }));

            if (!screen) {
                throw ApiError.NotFound(`Экрана с идентификатором ${screens_id} не найдено`);
            }

            // Изменение названия экрана
            screen.title = title;

            await screen.save({ transaction: t });

            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async screenGet(data) {
        try {
            const {
                link
            } = data;

            let result = {};

            const screen = await db.Screens.findOne({
                where: {
                    link: link
                }
            });

            if (!screen) {
                throw ApiError.NotFound(`Экрана с идентификатором ${screens_id} не найдено`);
            }

            result = { ...result, ...screen.dataValues };

            const screenTapes = await db.ScreensTapes.findAll({
                where: {
                    screens_id: screen.id
                }
            });

            const resultTapes = [];

            // Сбор подробной информации о всех лентах экрана
            for (let i = 0; i < screenTapes.length; i++) {
                let buffer = {};
                const screenTape = screenTapes[i];

                const tape = await db.Tapes.findOne({
                    where: {
                        id: screenTape.tapes_id
                    }
                });

                if (tape) {
                    buffer = { ...buffer, ...tape.dataValues };
                    const dataTapes = await db.DataTapes.findAll({
                        where: {
                            tapes_id: tape.id
                        }
                    });

                    const dataTapesResult = [];

                    // Определение типа контента
                    for (let j = 0; j < dataTapes.length; j++) {
                        const subItem = dataTapes[j];

                        if (subItem.table_name === "images") {
                            // Изображение
                            const image = await db.Images.findOne({
                                where: {
                                    id: subItem.data_id,
                                }
                            });

                            subItem.dataValues.filepath = `${config.get("url.api")}/${image.filepath}`;
                            subItem.dataValues.delay = image.delay;
                        } else if (subItem.table_name === "videos") {
                            // Видео
                            const video = await db.Videos.findOne({
                                where: {
                                    id: subItem.data_id,
                                }
                            });

                            subItem.dataValues.video_link = `${config.get("youtube.link")}${video.link}`;
                            subItem.dataValues.audio = video.audio;
                        } else if (subItem.table_name === "texts") {
                            // Текст
                            const text = await db.Texts.findOne({
                                where: {
                                    id: subItem.data_id,
                                }
                            });

                            subItem.dataValues.text = text.text;
                            subItem.dataValues.delay = text.delay;
                        } else if (subItem.table_name === "tables") {
                            // Таблица
                            const table = await db.Tables.findOne(({
                                where: {
                                    id: subItem.data_id
                                },
                                order: [['created_at', 'DESC']],
                                include: {
                                    model: db.DataTables,
                                }
                            }));

                            subItem.dataValues.columns = table.columns.split(';');
                            subItem.dataValues.rows = table.data_tables.map((value) => {
                                return value.row.split(';');
                            });
                            subItem.dataValues.delay = table.delay;
                        }

                        dataTapesResult.push(subItem.dataValues);
                    }

                    buffer.data_tapes = dataTapesResult;

                    resultTapes.push(buffer);
                }
            }

            result.tapes = resultTapes;

            return result;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async screenGetOne(data) {
        try {
            const {
                link
            } = data;

            let result = {};

            const screen = await db.Screens.findOne({
                where: {
                    link: link
                }
            });

            if (!screen) {
                throw ApiError.NotFound(`Экрана с идентификатором ${screens_id} не найдено`);
            }

            result = { ...result, ...screen.dataValues };

            const screenTapes = await db.ScreensTapes.findAll({
                where: {
                    screens_id: screen.id
                }
            });

            const resultTapes = [];

            // Сбор подробной информации о всех лентах экрана
            for (let i = 0; i < screenTapes.length; i++) {
                let buffer = {};
                const screenTape = screenTapes[i];

                const tape = await db.Tapes.findOne({
                    where: {
                        id: screenTape.tapes_id,
                        is_active: true
                    }
                });

                if (tape) {
                    buffer = { ...buffer, ...tape.dataValues };
                    const dataTapes = await db.DataTapes.findOne({
                        where: {
                            tapes_id: tape.id
                        }
                    });

                    const dataTapesResult = [];

                    // Определение типа контента
                    for (let j = 0; j < dataTapes.length; j++) {
                        const subItem = dataTapes[j];

                        if (subItem.table_name === "images") {
                            // Изображение
                            const image = await db.Images.findOne({
                                where: {
                                    id: subItem.data_id,
                                }
                            });

                            subItem.dataValues.filepath = `${config.get("url.api")}/${image.filepath}`;
                            subItem.dataValues.delay = image.delay;
                        } else if (subItem.table_name === "videos") {
                            // Видео
                            const video = await db.Videos.findOne({
                                where: {
                                    id: subItem.data_id,
                                }
                            });

                            subItem.dataValues.video_link = `${config.get("youtube.link")}${video.link}`;
                            subItem.dataValues.audio = video.audio;
                        } else if (subItem.table_name === "texts") {
                            // Текст
                            const text = await db.Texts.findOne({
                                where: {
                                    id: subItem.data_id,
                                }
                            });

                            subItem.dataValues.text = text.text;
                            subItem.dataValues.delay = text.delay;
                        } else if (subItem.table_name === "tables") {
                            // Таблица
                            const table = await db.Tables.findOne(({
                                where: {
                                    id: subItem.data_id
                                },
                                order: [['created_at', 'DESC']],
                                include: {
                                    model: db.DataTables,
                                }
                            }));

                            subItem.dataValues.columns = table.columns.split(';');
                            subItem.dataValues.rows = table.data_tables.map((value) => {
                                return value.row.split(';');
                            });
                            subItem.dataValues.delay = table.delay;
                        }

                        dataTapesResult.push(subItem.dataValues);
                    }

                    buffer.data_tapes = dataTapesResult;

                    resultTapes.push(buffer);
                }
            }

            result.tapes = resultTapes;

            return result;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async screenGetAll(data) {
        try {
            const {
                users_id,
            } = data;

            const screens = await db.Screens.findAll({
                where: {
                    users_id: users_id
                }
            });

            for(let i = 0; i < screens.length; i++) {
                const item = screens[i];

                const tape = await db.ScreensTapes.findOne({
                    where: {
                        screens_id: item.id
                    }
                });

                if(tape) {
                    item.dataValues.tape_exist = true;
                } else {
                    item.dataValues.tape_exist = false;
                }
            }

            return screens;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new UserScreenService();