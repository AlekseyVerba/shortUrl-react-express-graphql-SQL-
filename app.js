const express = require("express")
const app = express()
const sequelize = require("./utils/db")
const config = require('config');
const PORT = config.get("PORT") || 3000
const KEYS_SECRET = config.get("KEYS_SECRET")
const graphqlHTTP = require("express-graphql").graphqlHTTP
const schema = require("./graphql/schema")
const resolver = require("./graphql/resolver")
const session = require("express-session")
const redisStorage = require('connect-redis')(session)
const redis = require('redis')
const client = redis.createClient()
const jwt = require("jsonwebtoken")
const path = require("path")
// const PORT = 6379


app.use(express.json())
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(session({
    store: new redisStorage({client: client}),
    secret: KEYS_SECRET,
    resave: false,
    saveUninitialized: false,
}))

app.use((req, res, next) => {
    const isToken = req.headers.auth
    if (isToken) {
        req.currentUserId = jwt.verify(isToken, "just text").tokenUser
    }
    next()
})

app.use(
    '/graphql',
    graphqlHTTP((req, res, graphQLParams) => {
      return {
        schema,
        rootValue: resolver,
        graphiql: true,
        context: { 
            req
        },
      }
    })
  )


async function start() {
    try {
        await sequelize.sync()
        app.listen(PORT, () => {
            console.log(`Сервер запустился на порте ${PORT}`)
        })
    } catch(e) {
        throw new Error("Произошла ошибка подключения к базе данных")
        // process.exit()
    }
}


start()
