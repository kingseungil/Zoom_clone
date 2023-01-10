const messageList = document.querySelector('ul');
const messageForm = document.querySelector('form');
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

function handleSubmit(event) {
    event.preventDefault(); // form 안에 submit 역할을 하는 버튼을 눌렀어도 새로 실행하지 않게 하고싶을 경우 (submit은 작동됨)
    const input = messageForm.querySelector('input');
    socket.send(input.value);
    input.value = '';
}

messageForm.addEventListener('submit', handleSubmit);
