import express from 'express';
import http from 'http';
import WebSocket from 'ws';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/*', (req, res) => {
    res.redirect('/');
});

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Fake DB -> 다른 브라우저와 연결을 위해 만들어줌
const sockets = [];

wss.on('connection', (socket) => {
    sockets.push(socket);
    socket['nickname'] = '홍길동';
    console.log('브라우저와 연결됐어요~✅');
    socket.on('close', () => {
        console.log('브라우저와 연결이 해제됐어요!💥');
    });
    socket.on('message', (message) => {
        const parsed = JSON.parse(message);
        switch (parsed.type) {
            case 'new_message':
                sockets.forEach((aSocket) =>
                    aSocket.send(`${socket.nickname}: ${parsed.payload}`)
                );
            case 'nickname':
                socket['nickname'] = parsed.payload;
        }
    });
});

server.listen(3000, handleListen);
