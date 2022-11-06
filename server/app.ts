// const email = require('./email.js')
// const express = require('express')
// const app = express();

// email.sendMail('1720344233@qq.com')

import registerRouter from './router/register'
import loginRouter from './router/login';
import systemRouter from './router/system';
import express from 'express'
import cors from 'cors'

const 
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
 
app.get('/', function (req:any, res:any) {
   res.send("后端成功启动!!!");
})

app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/syetem', systemRouter)

 
var server = app.listen(8081, function () {
  var host = server.address()
  console.log("应用实例，访问地址为 http://%s:%s", host, server)
})
