import React from "react";
import ChannelSearch from "./ChannelSearch.jsx";
import { useChatContext } from "../context/chatContext.js";

const avatarColors = ["#f87171", "#60a5fa", "#7dd37b", "#fbbf5d", "#b35bd6", "#4ecdc4", "#f59e90"];

const getInitials = (name = "") => {
  const text = name.trim();
  if (!text) return "?";
  const parts = text.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const getAvatarColor = (value = "") => {
  const total = value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return avatarColors[total % avatarColors.length];
};

const CompanyHeader = () => (
  <div className="channel-list__header">
    <h1 className="channel-list__header__text">Chats</h1>
    <div className="channel-list__actions" aria-label="Chat actions">
      <button type="button" title="Theme">☼</button>
      <button type="button" title="New chat">+</button>
    </div>
  </div>
);

const ChannelListContainer = () => {
  const { chats, activeChat, selectChat, loading } = useChatContext();

  return (
    <aside className="channel-list__list__wrapper">
      <CompanyHeader />
      <ChannelSearch />
      <div className="team-channel-list">
        {loading && <p className="team-channel-list__message">Loading chats...</p>}
        {!loading && chats.length === 0 && (
          <p className="team-channel-list__message">Enter a user ID above and press Enter to start a chat.</p>
        )}
        {chats.map((chat) => {
          const name = chat.otherUser?.username || chat.otherUser?.id || "Unknown user";
          const selected = activeChat?.chatId === chat.chatId;

          return (
            <button
              className={selected ? "channel-preview__wrapper__selected" : "channel-preview__wrapper"}
              key={chat.chatId}
              onClick={() => selectChat(chat)}
              type="button"
            >
              <span className="conversation-avatar" style={{ backgroundColor: getAvatarColor(name) }}>
                {getInitials(name)}
                <span className="presence-dot" />
              </span>
              <span className="channel-preview__item single">
                <span className="conversation-row">
                  <strong>{name}</strong>
                  <time>Active</time>
                </span>
                <small>{chat.lastMessage || "No messages yet"}</small>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default ChannelListContainer;
