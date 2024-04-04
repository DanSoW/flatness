import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import DataRoles from './roles.js';
import config from "config";
import authService from '../../../services/auth/auth-service.js';

const initRoles = async (db) => {
    const t = await db.sequelize.transaction();
    try {
        for (let i = 0; i < DataRoles.length; i++) {
            const currentRole = DataRoles[i];

            const role = await db.Roles.findOne({
                where: {
                    title: currentRole.title,
                    description: currentRole.description,
                    priority: currentRole.priority
                }
            });

            if (!role) {
                await db.Roles.create({
                    title: currentRole.title,
                    description: currentRole.description,
                    priority: currentRole.priority
                }, { transaction: t });
            }
        }

        await t.commit();

        const adminList = config.get("admin_list");
        for (let i = 0; i < adminList.length; i++) {
            const item = adminList[i];

            const exists = await db.Users.findOne({
                where: {
                    email: item.email
                }
            }, { transaction: t });

            if (!exists) {

                await authService.signUp({
                    email: item.email,
                    password: item.password,
                }, t, true);
            }
        }
    } catch (e) {
        await t.rollback();
    }
};

export default initRoles;