import "./index.css";
import { io } from 'socket.io-client';
import { UserData } from "@/service/UserService";

// #1建立與node server連接
const clientIo = io()

// 取得網址內容
const url = new URL(location.href);
const userName = url.searchParams.get('user_name')
const roomName = url.searchParams.get('room_name')
// 檢查網址
if (!userName || !roomName) {
  location.href = '/main/main.html'
}
// user id
let userID = '';
type Msg = {
  userData: UserData;
  msg: string;
  time: number;
}

// 聊天室標題
const headerRoomName = document.getElementById('headerRoomName') as HTMLParagraphElement
headerRoomName.innerText = roomName || '-'
// 聊天室back按鈕
const backBtn = document.getElementById('backBtn') as HTMLButtonElement
backBtn.addEventListener('click', () => {
  location.href = '/main/main.html'
})

// 聊天室按鈕+發送訊息
const contentInput = document.getElementById('contentInput') as HTMLInputElement
const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement
submitBtn.addEventListener('click', () => {
  const msg = contentInput.value
  clientIo.emit('chat', msg)
})

const chatroom = document.getElementById('chatroom') as HTMLDivElement
// 將msg內容放回畫面
function putMsgs(data: Msg) {
  const date = new Date(data.time)
  const MsgTime = `${date.getHours()}:${date.getMinutes()}`

  const divBox = document.createElement('div')

  if (data.userData.id === userID) {
    divBox.classList.add('flex', 'justify-end', 'mb-4', 'items-end')
    divBox.innerHTML = `
    <p class="text-xs text-gray-700 mr-4" >${MsgTime}</p>
    <div>
      <p class="text-xs text-white mb-1 text-right" > ${data.userData.userName} </p>
      <p class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full">
      ${data.msg}
      </p>
    </div>`
  } else {
    divBox.classList.add('flex', 'justify-start', 'mb-4', 'items-end')
    divBox.innerHTML = `
    <div>
      <p class="text-xs text-gray-700 mb-1">${data.userData.userName} </p>
      <p class="mx-w-[50%] break-all bg-gray-800 px-4 py-2 rounded-tr-full rounded-br-full rounded-tl-full text-white">
        ${data.msg}
      </p>
    </div>
    <p class="text-xs text-gray-700 ml-4">${MsgTime}</p>`
  }

  chatroom.appendChild(divBox)
  // 清除input內容
  contentInput.value = ''
  // 自動往下
  chatroom.scrollTop = chatroom.scrollHeight
}
// 將提示內容放回畫面
function putHint(msg: string) {
  const divBox = document.createElement('div')
  divBox.classList.add('flex', 'justify-center', 'mb-4', 'items-center')
  divBox.innerHTML = `<p class="text-gray-700 text-sm">${msg}</p>`
  chatroom.append(divBox)
  chatroom.scrollTop = chatroom.scrollHeight
}


// #1建立與node server連接

// 加入聊天室提示
// 送到後端
clientIo.emit('join', { userName, roomName })
// 前端得到
clientIo.on('join', (msg) => {
  putHint(msg)
})

// 加入聊天內容
clientIo.on('chat', (data: Msg) => {
  putMsgs(data)
})

// 離開聊天室提示
clientIo.on('leave', (msg) => {
  putHint(msg)
})

// 接收user id
clientIo.on('UserID', (id) => {
  userID = id
})