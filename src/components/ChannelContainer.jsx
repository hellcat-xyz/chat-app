import React, { useEffect, useMemo, useRef, useState } from "react";
import { useChatContext } from "../context/chatContext.js";

const getInitials = (name = "") => {
  const text = name.trim();
  if (!text) return "?";
  const parts = text.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const formatMessageTime = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const ChannelContainer = ({ onLogout }) => {
  const [message, setMessage] = useState("");
  const { activeChat, error, messages, sendMessage, user } = useChatContext();
  const listRef = useRef(null);
  const activeName = activeChat?.otherUser?.username || activeChat?.otherUser?.id || "Select a chat";

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => new Date(a.datentime || 0) - new Date(b.datentime || 0));
  }, [messages]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [sortedMessages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(message);
    setMessage("");
  };

  return (
    <main className="channel__container">
      <header className="team-channel-header__container">
        <div className="team-channel-header__profile">
          <span className="conversation-avatar header-avatar">
            {getInitials(activeName)}
            {activeChat && <span className="presence-dot" />}
          </span>
          <div>
            <p className="team-channel-header__name">{activeName}</p>
            <span className="team-channel-header__right-text">{activeChat ? "online" : user?.email}</span>
          </div>
        </div>
        <div className="team-channel-header__actions">
          <button type="button" title="Voice call">☎</button>
          <button type="button" title="Video call">▣</button>
          <button type="button" title="Sign out" onClick={onLogout}>⋮</button>
        </div>
      </header>

      {error && <div className="chat-error">{error}</div>}

      <section className="message-list" ref={listRef}>
        <div className="date-pill">Today</div>
        {!activeChat && <p className="channel-empty__second">Choose a chat or start one with a user ID.</p>}
        {activeChat &&
          sortedMessages.map((item) => (
            <article className={item.userId === user?.userId ? "message-bubble own" : "message-bubble"} key={item.id}>
              <p>{item.content}</p>
              <time>{formatMessageTime(item.datentime)} {item.userId === user?.userId ? "✓" : ""}</time>
            </article>
          ))}
      </section>

      <form className="team-message-input__wrapper" onSubmit={handleSubmit}>
        <button className="input-icon-button" type="button" title="Attach file" disabled={!activeChat}>⌕</button>
        <button className="input-icon-button" type="button" title="Add image" disabled={!activeChat}>□</button>
        <input
          className="message-input"
          disabled={!activeChat}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={activeChat ? "Type a message..." : "Select a chat first"}
          type="text"
          value={message}
        />
        <button className="input-icon-button" type="button" title="Emoji" disabled={!activeChat}>☺</button>
        <button className="send-button" disabled={!activeChat || !message.trim()} type="submit" title="Send message">
          Send
        </button>
      </form>
    </main>
  );
};

export default ChannelContainer;
