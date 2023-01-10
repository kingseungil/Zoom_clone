const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

let roomName;

// 누가 들어왔을 때 화면에 표시
function enterUser(socketid) {
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = `${socketid}님이 방에 들어왔어요!`;
    ul.appendChild(li);
}
// 누가 나갔을 때 화면에 표시
function leaveUser(socketid) {
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = `${socketid}님이 방에서 나갔어요ㅠ`;
    ul.appendChild(li);
}
// 메시지 화면에 표시
function addMessage(message) {
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector('input');
    const value = input.value;
    socket.emit('newMessage', input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = '';
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    // room 이름 표시
    const h3 = room.querySelector('h3');
    h3.innerText = `Room : ${roomName}`;
    const form = room.querySelector('form');
    form.addEventListener('submit', handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    //! emit의 마지막 argument는 function
    // emit('eventName', arg1,arg2,..., function)
    socket.emit('enterRoom', input.value, showRoom);
    roomName = input.value;
    input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', enterUser);
socket.on('bye', leaveUser);
socket.on('message', addMessage);
