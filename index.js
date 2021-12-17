const TOKEN = process.env.TELEGRAM_TOKEN || '1923104416:AAFDo6lmyzyYGxLJdKACOWWvnNhc4YVYyrg';
const url = 'https://42b9-220-133-225-43.ngrok.io';
const port = process.env.PORT || 3000;

const express = require('express');
const app = express();
const TelegramBot = require('node-telegram-bot-api');

const server = require('http').Server(app);
const io = require('socket.io')(server);

const heartBeats = require('./HeartBeats');
// No need to pass any parameters as we will handle the updates with Express
const bot = new TelegramBot(TOKEN);

// This informs the Telegram servers of the new webhook.
bot.setWebHook(`${url}/bot${TOKEN}`);

// parse the updates to JSON
app.use(express.json());

// We are receiving updates at the route below!
app.post(`/bot${TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Start Express Server
// app.listen(port, () => {
//     console.log(`-----------------Express server is listening on ${port}---------------`);

//     Start();
// });

// Just to ping!
bot.on('message', msg => {
    console.log('Received Id: ' + msg.chat.id);
    bot.sendMessage(msg.chat.id, 'I am alive!!!!');
});


//=======================Socket io=======================
// 加入線上人數計數
let onlineCount = 0;
let ipAry = [];
 
app.get('/', (req, res) => {
    res.sendFile( __dirname + '/views/index.html');
});
 
io.on('connection', (socket) => {
    // 有連線發生時增加人數
    onlineCount++;
    // 發送人數給網頁
    // var address = socket.handshake.address;
    // ipAry.push(address.address)

    io.emit("online", onlineCount);
    // io.emit("online", `${onlineCount} - ${ipAry.join(',')}`);
    // io.emit("online", `${onlineCount} - ${address.address}:${address.port}`);
 
    socket.on("greet", () => {
        socket.emit("greet", onlineCount);
    });
 
    socket.on("send", (msg) => {
        // 如果 msg 內容鍵值小於 2 等於是訊息傳送不完全
        // 因此我們直接 return ，終止函式執行。
        if (Object.keys(msg).length < 2) return;

        //給我的bot
        bot.sendMessage('1684713021', `${msg.name}: ${msg.msg}`);
 
        // 廣播訊息到聊天室
        io.emit("msg", msg);

        
    });
 
    socket.on('disconnect', () => {
        // 有人離線了，扣人
        onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        
        io.emit("online", onlineCount);
    });
});
 
server.listen(port, () => {
    console.log("Server Started. http://localhost:" + port);
    Start()
});

function Start() {
    heartBeats.initialize(bot);
    heartBeats.start();
}