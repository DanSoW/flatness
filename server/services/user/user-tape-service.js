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
import { where } from 'sequelize';

/**
 * Контроллер для работы с текстами
 */
class UserTapeService {
    async tapesCopy(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, screens_id, tapes_id_source } = data;

            const tapeSource = await db.Tapes.findOne({
                where: {
                    id: tapes_id_source,
                    users_id: users_id
                }
            });

            if (!tapeSource) {
                throw ApiError.InternalServerError(`Ленты с идентификатором ${tapes_id_source} не найдено!`);
            }

            const screen = await db.Screens.findOne({
                where: {
                    id: screens_id,
                    users_id: users_id
                }
            });

            if (!screen) {
                throw ApiError.NotFound(`Экрана с идентификатором ${screens_id} не найдено`);
            }

            // Нельзя копировать, если она уже есть на данном экране
            let existScreenTape = await db.ScreensTapes.findOne({
                where: {
                    screens_id: screen.id,
                    tapes_id: tapeSource.id
                }
            });

            if (existScreenTape) {
                throw ApiError.BadRequest(`Лента \"${tapeSource.title}\" уже закреплена за данным экраном!`);
            }

            // Удаляем существующую связь
            existScreenTape = await db.ScreensTapes.findOne({
                where: {
                    screens_id: screen.id
                }
            });

            if (existScreenTape) {
                await existScreenTape.destroy({ transaction: t });
            }

            // Закрепление ленты за экраном
            const screenTape = await db.ScreensTapes.create({
                screens_id: screen.id,
                tapes_id: tapeSource.id
            }, { transaction: t });

            await t.commit();

            return tapeSource;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async tapesAdd(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, title, content } = data;

            const tape = await db.Tapes.create({
                users_id: users_id,
                title: title,
            }, { transaction: t });

            if (!tape) {
                throw ApiError.InternalServerError("Не удалось создать новую ленту");
            }

            // Добавление контента ленте
            for (let i = 0; i < content.length; i++) {
                const item = content[i];

                const dataTape = await db.DataTapes.create({
                    tapes_id: tape.id,
                    data_id: item.content_id,
                    table_name: TABLE_NAMES[item.type],
                    type: item.type,
                    queue_num: item.queue_num
                }, { transaction: t });
            }

            await t.commit();

            return tape;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async tapesDeleteFromScreen(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                screens_id,
            } = data;

            const screen = await db.Screens.findOne(({
                where: {
                    id: screens_id,
                    users_id: users_id,
                }
            }));

            if (!screen) {
                throw ApiError.NotFound(`Экрана с идентификатором ${screens_id} не найдено`);
            }

            const screenTape = await db.ScreensTapes.findOne({
                where: {
                    screens_id: screens_id
                }
            });

            if (!screenTape) {
                throw ApiError.NotFound("У данного экрана нет закреплённой ленты!");
            }

            // Открепление ленты от экрана
            await screenTape.destroy({ transaction: t });

            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async tapesDelete(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                tapes_id,
            } = data;

            const tape = await db.Tapes.findOne(({
                where: {
                    id: tapes_id,
                    users_id: users_id,
                }
            }));

            if (!tape) {
                throw ApiError.NotFound(`Ленты с идентификатором ${tapes_id} не найдено`);
            }

            const screenTape = await db.ScreensTapes.findOne({
                where: {
                    tapes_id: tapes_id
                }
            });

            if (screenTape) {
                throw ApiError.NotFound(`Лента с идентификатором ${tapes_id} используется в экранах! Для удаления ленты открепите её от экранов!`);
            }

            // Получение данных ленты
            const dataTapes = await db.DataTapes.findAll({
                where: {
                    tapes_id: tapes_id
                }
            });

            // Удаление всех привязок ленты к данным из хранилища
            for (let i = 0; i < dataTapes.length; i++) {
                await dataTapes[i].destroy({ transaction: t });
            }

            // Удаление ленты
            await tape.destroy({ transaction: t });
            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async tapesEdit(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, title, content, tapes_id } = data;

            const tape = await db.Tapes.findOne({
                where: {
                    id: tapes_id,
                    users_id: users_id
                }
            });

            if (!tape) {
                throw ApiError.InternalServerError(`Ленты с идентификатором ${tapes_id} не найдено!`);
            }

            tape.title = title;
            await tape.save({ transaction: t });

            // Удаление всех данных о ленте
            const dataTape = await db.DataTapes.findAll({
                where: {
                    tapes_id: tapes_id,
                }
            });

            for (let i = 0; i < dataTape.length; i++) {
                await dataTape[i].destroy({ transaction: t });
            }

            // Добавление нового контента ленте
            for (let i = 0; i < content.length; i++) {
                const item = content[i];

                const dataTape = await db.DataTapes.create({
                    tapes_id: tape.id,
                    data_id: item.content_id,
                    table_name: TABLE_NAMES[item.type],
                    type: item.type,
                    queue_num: item.queue_num
                }, { transaction: t });
            }

            await t.commit();

            return tape;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async tapesGet(data) {
        try {
            const {
                link
            } = data;

            const screen = await db.Screens.findOne({
                where: {
                    link: link
                }
            });

            if (!screen) {
                throw ApiError.NotFound(`Экрана с ссылкой ${link} не найдено`);
            }

            const screenTape = await db.ScreensTapes.findOne({
                where: {
                    screens_id: screen.id
                }
            });

            if (!screenTape) {
                throw ApiError.NotFound(`Активной ленты для экрана с идентификатором ${screen.id} не найдено`);
            }

            const tapes = await db.Tapes.findOne({
                where: {
                    id: screenTape.tapes_id
                },
                order: [['created_at', 'DESC']],
                include: {
                    model: db.DataTapes,
                    order: [['created_at', 'DESC']],
                }
            });

            for (let i = 0; i < tapes.data_tapes.length; i++) {
                const subItem = tapes.data_tapes[i];

                if (subItem.table_name === "images") {
                    const image = await db.Images.findOne({
                        where: {
                            id: subItem.data_id,
                        }
                    });

                    subItem.dataValues.filepath = `${config.get("url.api")}/${image.filepath}`;
                    subItem.dataValues.delay = image.delay;
                } else if (subItem.table_name === "videos") {
                    const video = await db.Videos.findOne({
                        where: {
                            id: subItem.data_id,
                        }
                    });

                    subItem.dataValues.video_link = `${config.get("youtube.link")}${video.link}`;
                    subItem.dataValues.audio = video.audio;
                } else if (subItem.table_name === "texts") {
                    const text = await db.Texts.findOne({
                        where: {
                            id: subItem.data_id,
                        }
                    });

                    subItem.dataValues.text = text.text;
                    subItem.dataValues.delay = text.delay;
                } else if (subItem.table_name === "tables") {
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
            }

            return tapes;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async tapesGetAll(data) {
        try {
            const {
                users_id,
            } = data;

            let tapes = await db.Tapes.findAll({
                where: {
                    users_id: users_id
                },
                include: {
                    model: db.DataTapes,
                }
            });

            for (let i = 0; i < tapes.length; i++) {
                const item = tapes[i];

                for (let j = 0; j < item.data_tapes.length; j++) {
                    const subItem = item.data_tapes[j];

                    if (subItem.table_name === "images") {
                        const image = await db.Images.findOne({
                            where: {
                                id: subItem.data_id,
                            }
                        });

                        subItem.dataValues.filepath = `${config.get("url.api")}/${image.filepath}`;
                    } else if (subItem.table_name === "videos") {
                        const video = await db.Videos.findOne({
                            where: {
                                id: subItem.data_id,
                            }
                        });

                        subItem.dataValues.video_link = `${config.get("youtube.link")}${video.link}`;
                        subItem.dataValues.audio = video.audio;
                    } else if (subItem.table_name === "texts") {
                        const text = await db.Texts.findOne({
                            where: {
                                id: subItem.data_id,
                            }
                        });

                        subItem.dataValues.text = text.text;
                    } else if (subItem.table_name === "tables") {
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
                    }
                }
            }

            tapes = tapes.sort((a, b) => {
                const dateA = new Date(a.updated_at);
                const dateB = new Date(b.updated_at);

                if (dateA > dateB) {
                    return -1;
                } else if (dateA < dateB) {
                    return 1;
                }

                return 0;
            });

            for (let item of tapes) {
                item.data_tapes = item.data_tapes.sort((a, b) => {
                    const queueA = a.queue_num;
                    const queueB = b.queue_num;

                    if (queueA > queueB) {
                        return 1;
                    } else if (queueA < queueB) {
                        return -1;
                    }

                    return 0;
                });
            }

            return {
                tapes: tapes
            };
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async tapesGetAllByScreen(data) {
        try {
            const {
                users_id,
                screens_id
            } = data;

            const screen = await db.Screens.findOne({
                where: {
                    id: screens_id
                }
            });

            if (!screen) {
                throw ApiError.NotFound(`Экрана с идентификатором ${screens_id} не найдено`);
            }

            const screensTapes = await db.ScreensTapes.findAll({
                where: {
                    screens_id: screens_id
                },
                include: {
                    model: db.Tapes,
                    include: {
                        model: db.DataTapes,
                    }
                }
            });

            let tapes = [];
            if (screensTapes.length > 0) {
                tapes = screensTapes.map((item) => {
                    return {
                        ...item.tape.dataValues,
                        is_active: item.is_active
                    };
                });
            }

            for (let i = 0; i < tapes.length; i++) {
                const item = tapes[i];

                for (let j = 0; j < item.data_tapes.length; j++) {
                    const subItem = item.data_tapes[j];

                    if (subItem.table_name === "images") {
                        const image = await db.Images.findOne({
                            where: {
                                id: subItem.data_id,
                            }
                        });

                        subItem.dataValues.filepath = `${config.get("url.api")}/${image.filepath}`;
                    } else if (subItem.table_name === "videos") {
                        const video = await db.Videos.findOne({
                            where: {
                                id: subItem.data_id,
                            }
                        });

                        subItem.dataValues.video_link = `${config.get("youtube.link")}${video.link}`;
                        subItem.dataValues.audio = video.audio;
                    } else if (subItem.table_name === "texts") {
                        const text = await db.Texts.findOne({
                            where: {
                                id: subItem.data_id,
                            }
                        });

                        subItem.dataValues.text = text.text;
                    } else if (subItem.table_name === "tables") {
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
                    }
                }
            }

            tapes = tapes.sort((a, b) => {
                const dateA = new Date(a.updated_at);
                const dateB = new Date(b.updated_at);

                if (dateA > dateB) {
                    return -1;
                } else if (dateA < dateB) {
                    return 1;
                }

                return 0;
            });

            for (let item of tapes) {
                item.data_tapes = item.data_tapes.sort((a, b) => {
                    const queueA = a.queue_num;
                    const queueB = b.queue_num;

                    if (queueA > queueB) {
                        return 1;
                    } else if (queueA < queueB) {
                        return -1;
                    }

                    return 0;
                });
            }

            return {
                tapes: tapes,
                screen: screen.dataValues
            };
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async tapesActive(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id, screens_id, tapes_id, active
            } = data;

            const activeScreenTape = await db.ScreensTapes.findOne({
                where: {
                    screens_id: screens_id,
                    is_active: true
                }
            });

            if (activeScreenTape) {
                activeScreenTape.is_active = false;
                await activeScreenTape.save({ transaction: t });
            }

            const screenTape = await db.ScreensTapes.findOne({
                where: {
                    screens_id: screens_id,
                    tapes_id: tapes_id
                }
            });

            if (!screenTape) {
                throw ApiError.NotFound(`Ленты c id = ${tapes_id} для экрана с идентификатором ${screens_id} не найдено`);
            }

            screenTape.is_active = active;
            await screenTape.save({ transaction: t });

            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new UserTapeService();