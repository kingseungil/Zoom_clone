import { log } from 'console';
import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';

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

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on('connection', (socket) => {
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on('enter_room', (roomName, done) => {
        socket.join(roomName);
        //! backend에서 done함수를 실행하면 front에서 backendDone함수 실행
        //! (done()은 실행버튼 역할임)
        done();
        // 나를 제외한 모두에게 emit
        socket.to(roomName).emit('welcome', socket.id);
    });
});

// // Fake DB -> 다른 브라우저와 연결을 위해 만들어줌
// const sockets = [];

// wss.on('connection', (socket) => {
//     sockets.push(socket);
//     socket['nickname'] = '홍길동';
//     console.log('브라우저와 연결됐어요~✅');
//     socket.on('close', () => {
//         console.log('브라우저와 연결이 해제됐어요!💥');
//     });
//     socket.on('message', (message) => {
//         const parsed = JSON.parse(message);
//         switch (parsed.type) {
//             case 'new_message':
//                 sockets.forEach((aSocket) =>
//                     aSocket.send(`${socket.nickname}: ${parsed.payload}`)
//                 );
//             case 'nickname':
//                 socket['nickname'] = parsed.payload;
//         }
//     });
// });

httpServer.listen(3000, handleListen);
