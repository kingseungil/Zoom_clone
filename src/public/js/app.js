const messageList = document.querySelector('ul');
const nickForm = document.querySelector('#nick');
const messageForm = document.querySelector('#message');
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

socket.addEventListener('open', () => {
    console.log('서버와 연결됐어요~✅');
});

socket.addEventListener('message', (message) => {
    // 화면에 message 출력
    const li = document.createElement('li');
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener('close', () => {
    console.log('서버와 연결이 해제됐어요~💥');
});

function handleSubmit(event) {
    event.preventDefault(); // form 안에 submit 역할을 하는 버튼을 눌렀어도 새로 실행하지 않게 하고싶을 경우 (submit은 작동됨)
    const input = messageForm.querySelector('input');
    socket.send(makeMessage('new_message', input.value));
    input.value = '';
}
function handleNickSubmit(event) {
    event.preventDefault(); // form 안에 submit 역할을 하는 버튼을 눌렀어도 새로 실행하지 않게 하고싶을 경우 (submit은 작동됨)
    const input = nickForm.querySelector('input');
    alert(`닉네임: ${input.value}`);
    socket.send(makeMessage('nickname', input.value));
    input.value = '';
}

messageForm.addEventListener('submit', handleSubmit);
nickForm.addEventListener('submit', handleNickSubmit);
