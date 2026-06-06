import React, { useState } from "react";
import { SearchIcon } from "../assets/SearchIcon.jsx";
import { useChatContext } from "../context/chatContext.js";

const ChannelSearch = () => {
  const [query, setQuery] = useState("");
  const { createChat } = useChatContext();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createChat(query);
    setQuery("");
  };

  return (
    <form className="channel-search__container" onSubmit={handleSubmit}>
      <div className="channel-search__input__wrapper">
        <span className="channel-search__input__icon" aria-hidden="true">
          <SearchIcon />
        </span>
        <input
          className="channel-search__input__text"
          placeholder="Search or enter user ID..."
          title="Enter a user ID and press Enter to start a chat"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
    </form>
  );
};

export default ChannelSearch;
