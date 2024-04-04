const MailerForms = {
    commonToUser: (name) => {
        return `
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="utf-8" />
            </head>
            <body>
                <div>
                    <h1>Здравствуйте, ${name}! Ваш запрос был успешно отправлен! В ближайшее время с Вами свяжется администратор.</h1>
                </div>
            </body>
            </html>
        `;
    },
    commonToAdmin: (name, email, phone) => {
        return `
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="utf-8" />
            </head>
            <body>
                <div>
                    <h1>Пользователь отправил форму для получения ответов на интересующие вопросы.</h1>
                    <div>
                        <p>Имя:</p>
                        <b>${name}</b>
                    </div>
                    <div>
                        <p>Email:</p>
                        <b>${email}</b>
                    </div>
                    <div>
                        <p>Phone:</p>
                        <b>${phone}</b>
                    </div>
                </div>
            </body>
            </html>
        `;
    },
    orderToUser: (name, door_title, article_title) => {
        return `
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="utf-8" />
            </head>
            <body>
                <div>
                    <h1>Здравствуйте, ${name}! Ваш запрос по двери ${door_title} с артикулом ${article_title} был успешно отправлен! В ближайшее время с Вами свяжется администратор.</h1>
                </div>
            </body>
            </html>
        `;
    },
    orderToAdmin: (name, email, phone, door_title, article_title) => {
        return `
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="utf-8" />
            </head>
            <body>
                <div>
                    <h1>Пользователь заинтересовался определённой дверью.</h1>
                    <div>
                        <p>Имя:</p>
                        <b>${name}</b>
                    </div>
                    <div>
                        <p>Email:</p>
                        <b>${email}</b>
                    </div>
                    <div>
                        <p>Phone:</p>
                        <b>${phone}</b>
                    </div>
                    <div>
                        <p>Название двери: </p>
                        <b>${door_title}</b>
                    </div>
                    <div>
                        <p>Артикул двери:</p>
                        <b>${article_title}</b>
                    </div>
                </div>
            </body>
            </html>
        `;
    },
};


export default MailerForms;