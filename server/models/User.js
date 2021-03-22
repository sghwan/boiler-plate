const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//pre() is mongoose mathod
userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
    //plainPassword 1234567  암호화된 비밀번호 $2b$10$jGlniBDG6N86J7naPyeu5u36c4cvYc7vVz..VDAEXaz4y6BOKCQfm
    //복호화를 못하기 때문에 plainPassword를 암호화 후 데이터베이스에 있는 암호와 비교
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function (cb) {

    var user = this;

    //jsonwebtoken을 이용해서 token을 생성하기

    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id
    // 내가 설정한 secretToken이라는 문자열을 통해 
    // user._id 와 'secertToken'을 합쳐 token을 생성한다.
    // 그러면 secretToken을 통해 user._id를 확인하고 
    // userSchema안에 있는 token에 생성된 token을 저장해줘야한다.

    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user);
        //cb(err(에러), user(정보))    
    })

}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    //user._id + '' = token
    //토큰을 복호화한다.
    jwt.verify(token, 'secretToken', function (err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }