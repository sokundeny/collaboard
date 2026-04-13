// import express from "express";
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { sequelize } from './models/index.js';
import boardRouter from './routes/board.route.js';
import userRouter from './routes/user.route.js';
import listRouter from './routes/list.routes.js';
import cardRouter from './routes/card.routes.js';
import ProfileRoute from './routes/profile.route.js';
import authRouter from './routes/auth.route.js';
import http from "http"
import {Server} from "socket.io"

// require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
sequelize.sync()

app.get("/api/health", (req, res) => {
    res.json({ message: "API is working!" });
});
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
app.use("/api/board",boardRouter);
app.use("/api/auth",authRouter)
app.use('/api/profile',ProfileRoute);
app.use("/api/card",cardRouter)
app.use("/api/list",listRouter)
app.use("/api/user",userRouter)

const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
});


io.on('connection',(socket)=>{
    console.log("socket Conneted",socket.id);

    socket.on('joinBoard',(boardId)=>{
        socket.join(`board-${boardId}`)
    })
    socket.on('boardChanged',({boardId})=>{
        socket.to(`board-${boardId}`).emit('refreshBoard');
        console.log('board change')
    })
    socket.on('disconnect',()=>{
        console.log('Socket Disconnect');
    })
})





const PORT = process.env.PORT ;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));