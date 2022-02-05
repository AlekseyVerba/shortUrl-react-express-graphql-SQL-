const User = require("../modules/User")
const PasswordToken = require("../modules/Password-token")
const Link = require("../modules/Link")
const bcrypt = require("bcryptjs")
const nodemailer = require('nodemailer')
const crypto = require("crypto")
const sendRegister = require("../mailer/register")
const sendRessetPassword = require("../mailer/ressetPassword")
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const config = require('config');



let transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465 ,
    secure: true,
    auth: {
      user: "verba.20@bk.ru",
      pass: "7ycBepAynJg13gbCW1sz",
    },
    tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
    },
  })



module.exports = {
    async addUser({user: {name, surname, city, birthday, email, password}}) {
        try {
            // const hashRegister = cryptoRandomString({length: 10});

            const candidate = await User.findAll({
                where: {
                    email: email
                }
            })
            if (candidate.length == 0) {
                const token = crypto.randomBytes(64).toString('hex');
                const hashPassword = await bcrypt.hash(password, 10)
                const create = await User.create({
                    name,
                    surname,
                    city: city ? city : null, 
                    birthday: birthday ? birthday : null,
                    email,
                    password: hashPassword,
                    tokenHash: token,
                    isConfirm: false
                })

                let result = await transporter.sendMail(sendRegister(email, name, token))

                return {
                    status: true,
                    message: "Подвердите ваш email. Вам отправлено сообщение"
                }

            } else {
                console.log("out 1")
                return {
                    status: false,
                    message: "Пользователь с таким email уже создан"
                }
            }

        } catch(e) {
            console.log("catch")
            return {
                status: false,
                message: "Произошла неизвестная ошибка"
            }
        }
    },

    async updateProfile({user: {name, surname, city, birthday, email}}, {req}) {
        try {
            const candidate = await User.findOne({
                where: {
                    id: req.currentUserId
                }
            })



            if (candidate) {
                if (name != candidate.name) {
                    candidate.name = name
                }
                if (surname != candidate.surname) {
                    candidate.surname = surname
                }
    
                if (city != candidate.city) {
                    candidate.city = city
                }
    
                if (birthday != candidate.birthday && birthday.trim.length > 0) {
                    candidate.birthday = birthday
                }
    
                if (email != candidate.email) {
                    candidate.email = email
                }

                await candidate.save()
                return {
                    status: true,
                    message: "Успешно"
                }
            } else {
                return {
                    status: false,
                    message: "Пользователь не найден"
                }
            }
        } catch(e) {
            return {
                status: false,
                message: "Произошла ошибка"
            }
        }
    },

    async checkToken({token}, parent) {
        try {
            const candidate = await User.findOne({
                where: {
                    tokenHash: token
                }
            })
            if (candidate) {
                if (!candidate.isConfirm) {
                    candidate.isConfirm = true
                    await candidate.save()
                    return {
                        status: true,
                        message: "Вы успешно подтвердили свою почту"
                    }
                } else {
                    return {
                        status: false,
                        message: `Пользователь уже активен`
                    }
                }

            } else {
                return {
                    status: false,
                    message: "Пользователя с таким токеном не найдено"
                }
            }

        } catch {
            return {
                status: false,
                message: "Неизвестная ошибка"
            }
        }
    },

    test() {
        return "Hello"
    },

    async checkAuth({authInfo: {login, password}}, {req}) {
        try {
            const candidate = await User.findOne({
                where: {
                    email: login
                }
            })

            if (candidate) {
                const {name, surname, city, birthday, email, isConfirm} = candidate
                if (isConfirm == 0) {
                    return {
                        user: null,
                        status: {
                            status: false,
                            message: "Данный пользователь ещё не прошёл проверку Email"
                        }
            
                    }
                }
                const isCompare = await bcrypt.compare(password, candidate.password)
                if (isCompare) {
                    if (!req.session.key) req.session.key = req.sessionID

                    const currentUser = {name, surname, city, birthday, email}
                    // req.session.isAuth = true
                    // req.session.currentUser = currentUser
                    req.session.isAuth = true
                    
                    req.session.currentUser = currentUser
                    const token = jwt.sign(
                        {tokenUser: candidate.id},
                        "just text"
                    )
                    return {
                        user: currentUser,
                        status: {
                            status: true,
                            message: "Успешно",
                        },
                        userInfo: {
                            tokenUser: token,
                            userId: candidate.id
                        }
                    }
                } else {
                    return {
                        user: null,
                        status: {
                            status: false,
                            message: "Неверный пароль"
                        }
            
                    }
                }
            } else {
                return {
                    user: null,
                    status: {
                        status: false,
                        message: "Пользователь с таким email не существует"
                    }
        
                }
            }

        } catch(e) {
            console.log(e)
        }
    },

    async resetPassword({email}) {
        try {
            const candidate = await User.findOne({
                where: {
                    email: email
                }
            })
            if (candidate) {
                const token = crypto.randomBytes(64).toString('hex');
                let candidateToken = await PasswordToken.findOne({
                    where: {
                        idUser: candidate.id
                    }
                })
                if (candidateToken) {
                    candidateToken.token = token
                    await candidateToken.save()
                } else {
                    const newToken = await PasswordToken.create({
                        idUser: candidate.id,
                        token: token
                    })
                }

                let result = await transporter.sendMail(sendRessetPassword(email, token))


                
                return {
                    status: true,
                    message: "На ваш Email отправлено сообщение с ссылкой"
                }
            } else {
                return {
                    status: false,
                    message: "Пользователя с таким Email не найдено"
                }
            }
        } catch(e) {
            console.log(e)
        }
    },

    async checkTokenPassword({token}) {
        const candidateToken = await PasswordToken.findOne({
            where: {
                token
            } 
        })
        if (candidateToken) {
            return {
                status: true,
                message: "Токен подтвержден"
            }
        } else {
            return {
                status: false,
                message: "Такого токена не существует"
            }
        }
    },

    async updatePassword({info: {newPassword, token}}) {
        const candidateToken = await PasswordToken.findOne({
            where: {
                token: token
            }
        })
        if (candidateToken) {
            const candidateUser = await User.findOne({
                where: {
                    id: candidateToken.idUser
                }
            })
            if (candidateUser) {
                const hashPassword = await bcrypt.hash(newPassword, 10)
                candidateUser.password = hashPassword
                await candidateUser.save()
                return {
                    status: true,
                    message: "Пароль был обновлен"
                }
            } else {
                return {
                    status: false,
                    message: "Пользователь с id токена не найден"
                }
            }
        } else {
            return {
                status: false,
                message: "Проблемы с токеном"
            }
        }
    },

    async createLink({link}, {req}) {
        const currentUserId = req.currentUserId
        if (currentUserId) {
            try {
                const candidateLink = await Link.findOne({
                    where: {
                        idUser: currentUserId,
                        from: link
                    }
                })
    
                if (!candidateLink) {
                    let shortCode = shortid.generate()
                    let isShowLink = true
                    while(isShowLink) {
                        const checkCode = await Link.findOne({ 
                            where: {
                                code: shortCode
                            }
                        })
                        if (!checkCode) {
                            isShowLink = false
                        }
                    }
    
                    const newUrl = await Link.create({
                        idUser: currentUserId,
                        from: link,
                        to: config.get("CURRENT_URL") + "t/" + shortCode,
                        code: shortCode
                    })
    
                    return {
                        status: true,
                        message: "Ссылка была создана",
                        urlLink: newUrl.code
                    }
                } else {
                    return {
                        status: false,
                        message: "Данная ссылка у пользователя уже создана",
                        urlLink: candidateLink.code
                    }
                }
            } catch(e) {
                return {
                    status: false,
                    message: "Произошла ошибка"
                }
            }
        } else {
            return {
                status: false,
                message: "Вы не авторизованы"
            }
        }
    },

    async getLinks({so},{req}) {
        if (req.currentUserId) {
            try {
                const items = await Link.findAll({
                    where: {
                        idUser: req.currentUserId
                    }
                })
                const itemsArray = []
                items.forEach(item => {
                    itemsArray.push({
                        id: item.id,
                        from: item.from,
                        to: item.to,
                        code: item.code,
                        clicks: item.clicks,
                        shortDescription: item.shortDescription,
                        created: item.createdAt
                    })
                })
                return {
                    links: itemsArray,
                    status: true,
                    message: "Успешно"
                }
            } catch(e) {
                return {
                    links: null,
                    status: false,
                    message: "Произошла ошибка"
                }
            }
        } else {
            return {
                links: null,
                status: false,
                message: "Вы не авторизованы"
            }
        }
    },

    async deleteLink({id}, {req}) {
        if (req.currentUserId) {
            try {
                const currentLink = await Link.findOne({
                    where: {
                        id: id
                    }
                })
                if (currentLink) {
                    currentLink.destroy()
                    currentLink.save()
                    return {
                        status: true,
                        message: "Успешно"
                    }
                } else {
                    return {
                        status: false,
                        message: "Ссылки не найдено"
                    }
                }
            } catch(e) {
                return {
                    status: false,
                    message: "Произошла ошибка"
                }
            }

        } else {
            return {
                status: false,
                message: "Вы не авторизованы"
            }
        }
    },

    async redirectToUrl({code}) {
        try {
            const currentLink = await Link.findOne({
                where: {
                    code: code
                }
            })
            if (currentLink) {
                currentLink.clicks++
                await currentLink.save()
                return {
                    status: true,
                    message: "Происходит перенаправление",
                    url: currentLink.from
                } 
            } else {
                return {
                    status: false,
                    message: "Данной ссылки не найдено",
                    url: null
                } 
            }
        } catch(e) {
            return {
                status: false,
                message: "Произошла ошибка",
                url: null
            } 
        }
    },

    async changeDescription({info: {id, description}}, {req}) {
        try {
            const candidateLink = await Link.findOne({
                where: {
                    id
                }
            })
            if (candidateLink.idUser === req.currentUserId) {
                candidateLink.shortDescription = description
                await candidateLink.save()
                return {
                    status: true,
                    message: "Успешно"
                }
            } else {
                return {
                    status: false,
                    message: "У вас нет прав изменять данную ссылку"
                }
            }
        } catch(e) {
            return {
                status: false,
                message: "Произошла ошибка"
            }
        }


    },

    async getCurrentUser({test}, {req}) {
        if (req.currentUserId) {
            try {
                const candidate = await User.findOne({
                    where: {
                        id: req.currentUserId
                    }
                })
                if (candidate) {
                    return {
                        status: {
                            status: true,
                            message: `Успешно. Получен пользователь с id - ${candidate.id}`
                        },
                        user: candidate
                    }
                } else {
                    return {
                        status: {
                            status: false,
                            message: "Пользователя с вашим id не найдено"
                        },
                        user: null
                    }
                }
            } catch(e) {
                return {
                    status: {
                        status: false,
                        message: "Произошла ошибка"
                    },
                    user: null
                }
            }
        } else {
            return {
                status: {
                    status: false,
                    message: "Вы не авторизованы"
                },
                user: null
            }
        }

    }
}