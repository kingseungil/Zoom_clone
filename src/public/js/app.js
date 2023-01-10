const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener('open', () => {
    console.log('서버와 연결됐어요~✅');
});

socket.addEventListener('message', (message) => {
    console.log('새로운 메시지: ', message.data, '(서버에서 왔네요!)');
});

socket.addEventListener('close', () => {
    console.log('서버와 연결이 해제됐어요~💥');
});

setTimeout(() => {
    // socket.send('안녕하세요 브라우저에요!');
    socket.send('안녕하세요 브라우저에요!');
}, 3000);
