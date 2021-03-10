const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require("./models/User");

//bodyparser는 클라이언트에서의 정보를 서버로 가져오는 것
//그중
//1. application/x-www-form-urlencoded 형태의 데이터를 분석해서 가져오는 것
app.use(bodyParser.urlencoded({extended: true}));

//2. application/json 형태의 데이터를 데이터를 분석해서 가져오는 것
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Hello World!ㅎㅎㅎㅎㅎz')
})

app.post('/register',(req,res) => {
    //회원가입 할 때 필요한 정보들을 클라이언트에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.

    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({success: true})
    })

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})