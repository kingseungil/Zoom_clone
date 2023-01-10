const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;

let roomName;

// 누가 들어왔을 때 화면에 표시
function addUser(socketid) {
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = `${socketid}님이 방에 들어왔어요!`;
    ul.appendChild(li);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    // room 이름 표시
    const h3 = room.querySelector('h3');
    h3.innerText = `Room : ${roomName}`;
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector('input');
    //! emit의 마지막 argument는 function
    // emit('eventName', arg1,arg2,..., function)
    socket.emit('enter_room', input.value, showRoom);
    roomName = input.value;
    input.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', addUser);
