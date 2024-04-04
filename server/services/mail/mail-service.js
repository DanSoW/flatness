import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

import config from "config";
import nodemailer from 'nodemailer';

/* Сервис для отправки почтовых сообщений */
class MailService {
    transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.get('smtp.host'),
            port: config.get('smtp.port'),
            secure: false,
            auth: {
                user: config.get('smtp.user'),
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    /**
     * Отправка письма активации аккаунта
     * @param {string} to Кому отправить письмо
     * @param {string} link Ссылка для активации аккаунта
     */
    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: `NetMan Game Systems <${config.get('smtp.user')}>`,
            to,
            subject: 'Активация аккаунта пользователя',
            text: '',
            html:
                `
                <!DOCTYPE html>
		        <html lang="ru">
	  		    <head>
				    <meta charset="utf-8" />
	  		    </head>
	  	        <body>
                    <div>
                        <h1> Для активации аккаунта перейдите по <a href="${link}">ссылке</a> </h1>
                        <a href="${link}">Ссылка для активации аккаунта</a>
                        <br />
                        <p>Если Вы не регистрировались в NetMan Game Systems, то проигнорируйте данное сообщение</p>
                    </div>
	            </body>
	            </html>
                `
        });
    }

    /**
     * Отправка общей формы
     * @param {string} to Кому отправить письмо
     * @param {string} link Ссылка для активации аккаунта
     */
    async sendMail(to, subject, html) {
        await this.transporter.sendMail({
            from: `Двери ГРАНИТ <${config.get('smtp.user')}>`,
            to,
            subject: subject,
            text: '',
            html: html
        });
    }
}

export default new MailService();