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

/**
 * Контроллер для работы с текстами
 */
class UserVideoService {
    async videosAdd(data) {
        const t = await db.sequelize.transaction();

        try {
            const { users_id, link, audio } = data;

            const resText = await db.Videos.create({
                users_id: users_id,
                link: link,
                audio: audio
            }, { transaction: t });

            await t.commit();

            return resText;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async videosDelete(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                videos_id,
            } = data;

            const link = await db.Videos.findOne(({
                where: {
                    id: videos_id,
                    users_id: users_id,
                }
            }));

            if (!link) {
                throw ApiError.NotFound(`Видео с идентификатором ${videos_id} не найдено`);
            }

            const findUse = await db.DataTapes.findOne({
                where: {
                    data_id: videos_id,
                    type: "video"
                }
            });

            if (findUse) {
                throw ApiError.NotFound(`Видео с идентификатором ${videos_id} используется в лентах, удаление невозможно!`);
            }

            await link.destroy({ transaction: t });
            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async videosEdit(data) {
        const t = await db.sequelize.transaction();

        try {
            const {
                users_id,
                videos_id,
                link,
                audio
            } = data;

            const resText = await db.Videos.findOne(({
                where: {
                    id: videos_id,
                    users_id: users_id,
                }
            }));

            if (!resText) {
                throw ApiError.NotFound(`Видео с идентификатором ${videos_id} не найдено`);
            }


            resText.link = link
            resText.audio = audio;
            await resText.save({ transaction: t });

            await t.commit();

            return data;
        } catch (e) {
            await t.rollback();
            throw ApiError.BadRequest(e.message);
        }
    }

    async videosGet(data) {
        try {
            const {
                users_id,
                videos_id,
            } = data;

            const link = await db.Videos.findOne(({
                where: {
                    id: videos_id,
                    users_id: users_id
                }
            }));

            return link;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }

    async videosGetAll(data) {
        try {
            const {
                users_id,
            } = data;

            const videos = await db.Videos.findAll(({
                where: {
                    users_id: users_id
                },
                order: [['created_at', 'DESC']]
            }));

            for(let i = 0; i < videos.length; i++){
                const link = videos[i].link;
                videos[i].dataValues.link = `${config.get("youtube.link")}${link}`;
            }

            // https://www.youtube.com/embed/

            return videos;
        } catch (e) {
            throw ApiError.BadRequest(e.message);
        }
    }
}

export default new UserVideoService();