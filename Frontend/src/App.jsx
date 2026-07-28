import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import "./App.css";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FlashMessage from "./FlashMessage.jsx";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]); //store all chats of curr thread
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");

  const providervalues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
    sidebarOpen,
    setSidebarOpen,
    error,
    setError,
  }; //passing values

  return (
    <div className="app">
      <MyContext.Provider value={providervalues}>
        <Sidebar></Sidebar>
        {sidebarOpen && (
          <div
            className="sidebarOverlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <ChatWindow></ChatWindow>
        <FlashMessage message={error} onClose={() => setError("")} />
      </MyContext.Provider>
    </div>
  );
}

export default App;
