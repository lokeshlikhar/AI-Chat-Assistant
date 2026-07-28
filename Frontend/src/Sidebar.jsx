import { useCallback, useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import "./Sidebar.css";
import { v4 as uuidv4 } from "uuid";
import blackLogo from "./assets/newjpg.jpg";
import API_URL from "./config.js";

const getShortTitle = (title, wordLimit = 4) => {
  const words = title.trim().split(/\s+/);
  return words.length > wordLimit
    ? `${words.slice(0, wordLimit).join(" ")}…`
    : title;
};

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
    sidebarOpen,
    setSidebarOpen,
    setError,
  } = useContext(MyContext);

  const getAllThreads = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/thread`);
      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.err || "Unable to load chats");
      }

      //store threadId , title
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));

      setAllThreads(filteredData);
    } catch (err) {
      setError(err.message || "Unable to load chats");
    }
  }, [setAllThreads, setError]);

  useEffect(() => {
    getAllThreads();
  }, [currThreadId, getAllThreads]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv4());
    setPrevChats([]);
    setSidebarOpen(false);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(`${API_URL}/api/thread/${newThreadId}`);
      const res = await response.json();
      if (!response.ok) {
        throw new Error(res.err || "Unable to open this chat");
      }

      setPrevChats(res.messages);
      setNewChat(false);
      setReply(null);
      setSidebarOpen(false);
    } catch (err) {
      setError(err.message || "Unable to open this chat");
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`${API_URL}/api/thread/${threadId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.err || "Unable to delete this chat");
      }

      //after deleteing re-render updates threads
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId),
      );

      //if we delete currThread ..so we need to start newchat
      if (threadId == currThreadId) {
        createNewChat();
      }
    } catch (err) {
      setError(err.message || "Unable to delete this chat");
    }
  };

  return (
    <section className={`sidebar ${sidebarOpen ? "sidebarOpen" : ""}`}>
      <div className="sidebarTop">
        <div className="brand">
          <img src={blackLogo} alt="" className="brandLogo" />
          <span>AI Chat</span>
        </div>
        <button
          className="closeSidebar"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      {/* new chat button  */}
      <button className="newChatButton" onClick={createNewChat}>
        <span>New chat</span>
        <i className="fa-solid fa-pen-to-square"></i>
      </button>

      <ul className="history">
        {allThreads?.map((thread) => (
          <li
            key={thread.threadId}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : " "}
            title={thread.title}
          >
            {getShortTitle(thread.title)}
            <i
              className="fa-solid fa-trash delete"
              onClick={(e) => {
                e.stopPropagation(); //stop event bubbling ..means parents div will not get click
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      {/* sign */}
      <div className="sign">
        <span className="signDot"></span>
        <p>Built by Lokesh</p>
      </div>
    </section>
  );
}
export default Sidebar;
