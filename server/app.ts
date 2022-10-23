// const email = require('./email.js')
// const express = require('express')
// const app = express();

// email.sendMail('1720344233@qq.com')

import registerRouter from './router/register'
import loginRouter from './router/login';
import express from 'express'
import cors from 'cors'

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
 
app.get('/', function (req:any, res:any) {
   res.send(req.query);
})

app.use('/register', registerRouter)
app.use('/login', loginRouter)

 
var server = app.listen(8081, function () {
  var host = server.address()
  console.log("应用实例，访问地址为 http://%s:%s", host, server)
})
