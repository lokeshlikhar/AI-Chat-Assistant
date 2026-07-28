import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import { BeatLoader } from "react-spinners";
import API_URL from "./config.js";
const MAX_MESSAGE_LENGTH = 4000;
function ChatWindow() {
  const {
    prompt,
    setPrompt,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    setSidebarOpen,
    setError,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    const message = prompt.trim();

    // Prevent blank messages and duplicate requests
    if (!message || loading) return;

    setLoading(true);
    setNewChat(false);
    setPrompt("");

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          threadId: currThreadId,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.err || "Failed to get an AI response");
      }
      setReply(data.reply);
      setPrevChats((chats) => [
        ...chats,
        { role: "user", content: message },
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      // console.error(err);
      setError(err.message || "Unable to send your message. Please try again.");
      setPrompt(message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="chatWindow">
      <div className="navbar">
        <div className="navTitle">
          <button
            className="menuButton"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <span>
            AI Chat Assistant <i className="fa-solid fa-chevron-down"></i>
          </span>
        </div>
        <button
          className="userIconDiv"
          onClick={handleProfileClick}
          aria-label="Open profile menu"
        >
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </button>
      </div>
      <div className="learningNotice" role="note">
        <i className="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
        <span>
          <strong>Learning project:</strong> this app uses a limited free AI
          API. Please keep messages concise.
        </span>
      </div>
      {/* dropdwon  */}
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i>Settings
          </div>
          <div className="dropDownItem">
            {" "}
            <i className="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-right-from-bracket"></i>Log out
          </div>
        </div>
      )}
      <Chat> </Chat>
      <BeatLoader color="white" loading={loading}></BeatLoader>
      <div className="chatInput">
        <div className="inputBox">
          <input
            type="text"
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            maxLength={MAX_MESSAGE_LENGTH}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading && prompt.trim()) {
                getReply();
              }
            }}
          />
          <button
            id="submit"
            type="button"
            onClick={getReply}
            disabled={loading || !prompt.trim()}
            aria-label="Send message"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <p className="info">
          AI Chat Assistant can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
export default ChatWindow;
