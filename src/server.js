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

function publicRooms() {
    const { sids, rooms } = wsServer.sockets.adapter;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

// 채팅방에 몇명있는지
function countRoom(roomName) {
    const roomSize = wsServer.sockets.adapter.rooms.get(roomName)?.size;
    return roomSize;
}

wsServer.on('connection', (socket) => {
    socket['nickname'] = '익명의 누군가';
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on('enterRoom', (roomName, done) => {
        socket.join(roomName);
        //! backend에서 done함수를 실행하면 front에서 backendDone함수 실행
        //! (done()은 실행버튼 역할임)
        done();
        // 나를 제외한 모두에게 emit
        socket
            .to(roomName)
            .emit('welcome', socket.nickname, countRoom(roomName));
        wsServer.sockets.emit('roomChange', publicRooms());
    });
    socket.on('disconnecting', () => {
        // socket.rooms => set(2) { zxzse123...} 이런 형식
        socket.rooms.forEach((room) =>
            socket.to(room).emit('bye', socket.nickname, countRoom(room) - 1)
        );
    });
    socket.on('disconnect', () => {
        // 모든 클라이언트에게 보내주기
        wsServer.sockets.emit('roomChange', publicRooms());
    });
    socket.on('newMessage', (msg, room, done) => {
        socket.to(room).emit('message', `${socket.nickname}:${msg}`);
        done();
    });
    socket.on('nickname', (nickname) => (socket['nickname'] = nickname));
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
