var express = require('express');
// var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())
 
app.get('/', function (req, res) {
   res.send(req.query);
})

app.post('/register',(req,res)=>{
    let data = req.body.data
    switch(data.interface){
        case 'register':
            register();
            break;
        case 'verifyEmail':
            verifyEmail();
            break;
        case 'sendCode':
            sendCode();
            break;
        case 'verifyCode':
            verifyCode();
            break;
        default:
            break;
    }

    res.send(req.query)
})

 
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
