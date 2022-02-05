module.exports = (mailTo, token) => {
    return {
        from: 'verba.20@bk.ru',
        to: mailTo,
        subject: 'Ссылка с восстановлением пароля',
        text: '',
        html:
            `
            <div>
                Перейдите по ссылке, что бы восстановить пароль <br>
                <a href="http://localhost:3000/reset-password/${token}">Переход</a>
            </div>`,
    }
}