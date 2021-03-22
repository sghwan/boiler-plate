//개발환경과 프로덕션일때의 url을 분리 dev, prod
if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}