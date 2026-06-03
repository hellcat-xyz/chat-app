const http = require('http')
const express = require('express')
const helmet = require('helmet')
console.clear()
const app = express();
const server = http.createServer(app)
const { Server } = require('socket.io')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT

app.use(cors())

with backticks for template literals
const io = new Server(server, {
  cors: {
    origin: "http://localhost:${PORT}",
    methods: ["GET","POST"]
  }
})

app.set("io", io)

app.use(helmet())
app.use(express.json());

const authRouter = require('./routes/Authentication/auth')
const userRouter = require('./routes/Users/profile')
const mainRouter = require('./routes/index')
const chatRouter = require('./routes/Messages/chat')
const messageRouter = require('./routes/Messages/message')
const socketHandler = require('./socket/index')

app.use('/', mainRouter)
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/chat', chatRouter)
app.use('/message', messageRouter)

socketHandler(io)

server.listen(3000, () => {
  console.log("Server is running...")
})
