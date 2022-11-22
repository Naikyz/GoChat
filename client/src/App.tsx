import { useState, useEffect } from 'react'
import './App.css'

interface message {
  data: string
}

interface Imessages {
  username: string
  content: string
}

function App() {

  const [ws, setWs] = useState(null as unknown as WebSocket);

  useEffect(() => {
    setWs(new WebSocket("ws://" + window.location.hostname + ":4000/ws"))

    return () => {
      ws != null && ws.close()
    }
  }, [])

  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<Imessages>>([]);


  function messagesList(wsData: Imessages) {
    // console.log(wsData)
    setChatMessages([...chatMessages, wsData])
    // console.log(chatMessages)
  }

  if (ws != null)
    ws.onmessage = (message: message) => {
      messagesList(JSON.parse(message.data))
      console.log()
    }

  const handleClick = (e: any) => {
    e.preventDefault();
    const data = {
      username: name,
      content: msg
    }
    ws.send(JSON.stringify(data))
    setMsg("")
  }

  return (
    <div className="chat-all">
      <h1 className="chat-title">GoChat by Naikyz</h1>
      <div id="chat-status"></div>
      <form className="chat-container" id="chat" onSubmit={handleClick}>
        <input required name="username" className="chat-username" placeholder="Enter name..." onChange={(e) => { setName(e.target.value) }} value={name} />
        <div className="card">
          <ul id="messages" className="messages-list">
            {chatMessages.length > 0 && chatMessages.map((item, i) => <li key={`chatMessage_${i}`}>{item.username + ": " + item.content}</li>)}
          </ul>
        </div>
        <textarea name="inputMessage" className="chat-message" placeholder="Enter message..." onChange={(e) => setMsg(e.target.value)} value={msg}></textarea>
        <button type="submit" className="btn">Send</button>
      </form>
    </div>
  )
}

export default App
