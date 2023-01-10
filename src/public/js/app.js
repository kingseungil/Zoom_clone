const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

let roomName;

// 누가 들어왔을 때 화면에 표시
function enterUser(nickname) {
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = `${nickname}님이 방에 들어왔어요!`;
    ul.appendChild(li);
}
// 누가 나갔을 때 화면에 표시
function leaveUser(nickname) {
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = `${nickname}님이 방에서 나갔어요ㅠ`;
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
    const input = room.querySelector('#msg input');
    const value = input.value;
    socket.emit('newMessage', input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = '';
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = welcome.querySelector('#name input');
    socket.emit('nickname', input.value);
    alert('닉네임 저장완료!');
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    // room 이름 표시
    const h3 = room.querySelector('h3');
    h3.innerText = `Room : ${roomName}`;
    const msgForm = room.querySelector('#msg');
    msgForm.addEventListener('submit', handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = welcome.querySelector('#roomName input');
    //! emit의 마지막 argument는 function
    // emit('eventName', arg1,arg2,..., function)
    socket.emit('enterRoom', input.value, showRoom);
    roomName = input.value;
    input.value = '';
}

const roomForm = welcome.querySelector('#roomName');
roomForm.addEventListener('submit', handleRoomSubmit);
const nameForm = welcome.querySelector('#name');
nameForm.addEventListener('submit', handleNicknameSubmit);

socket.on('welcome', enterUser);
socket.on('bye', leaveUser);
socket.on('message', addMessage);
socket.on('roomChange', (rooms) => {
    const roomList = welcome.querySelector('ul');
    roomList.innerHTML = '';
    if (rooms.length === 0) {
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement('li');
        li.innerText = room;
        roomList.append(li);
    });
});
