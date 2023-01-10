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

wss.on('connection', (socket) => {
    console.log('브라우저와 연결됐어요~✅');
    socket.on('close', () => {
        console.log('브라우저와 연결이 해제됐어요!💥');
    });
    socket.on('message', (message) => {
        console.log('브라우저에서 온 메시지:', message.toString());
    });
    socket.send('서버에서 보내는 메시지에요!');
});

server.listen(3000, handleListen);
