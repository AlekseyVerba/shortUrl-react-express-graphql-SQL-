module.exports = (mailTo, name, token) => {
    return {
        from: 'verba.20@bk.ru',
        to: mailTo,
        subject: 'Код с подтверждением',
        text: '',
        html:
            `<h4>Привет, ${name}</h4>
            <div>
                Перейдите по ссылке, что бы активировать ваш аккаунт <br>
                <a href="http://localhost:3000/confirm-register/${token}">Переход</a>
            </div>`,
    }
}