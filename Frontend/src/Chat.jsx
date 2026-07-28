import "./Chat.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
//for gptmessage formatting
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    //latest reply seprate ..and typing effect
    if (!reply || !prevChats.length) {
      return;
    }

    const content = reply.split(" "); //individuals words
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply({
        reply,
        content: content.slice(0, idx + 1).join(" "),
      });
      idx++;
      if (idx >= content.length) {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [prevChats, reply]);
  return (
    <>
      {newChat && (
        <section className="welcome">
          <h1>How can I help you today?</h1>
          <p>Ask a question, explore an idea, or start a new conversation.</p>
        </section>
      )}
      <div className="chats">
        <div className="chatContent">
          {prevChats?.slice(0, -1).map((chat, idx) => (
            <div
              className={chat.role === "user" ? "userDiv" : "gptDiv"}
              key={idx}
            >
              {chat.role === "user" ? (
                <p className="userMessage">{chat.content}</p>
              ) : (
                // <p className="gptMessage">{chat.content}</p>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </ReactMarkdown>
              )}
            </div>
          ))}
          {prevChats.length > 0 && (
            <>
              {latestReply?.reply !== reply ? (
                <div className="gptDiv" key={"non-typing"}>
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {prevChats[prevChats.length - 1].content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="gptDiv" key={"typing"}>
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {latestReply.content}
                  </ReactMarkdown>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default Chat;
