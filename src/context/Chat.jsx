import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ChatContext } from "./chatContext.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const Chat = ({ client, token, children }) => {
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const api = useMemo(() => {
        return axios.create({
            baseURL: API_URL,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }, [token]);

    const loadProfile = useCallback(async () => {
        const { data } = await api.get("/user/profile");
        setUser(data.user);
    }, [api]);

    const loadChats = useCallback(async () => {
        const { data } = await api.get("/chat");
        setChats(data.formattedOutput || []);
    }, [api]);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            setError("");

            try {
                await Promise.all([
                    loadProfile(),
                    loadChats()
                ]);
            } catch (err) {
                setError(
                    err.response?.data?.error ||
                    "Unable to load chat data."
                );
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [loadProfile, loadChats]);

    useEffect(() => {
        const cleanup = client.onMessage((message) => {
            loadChats();

            if (message.chatId !== activeChat?.chatId) {
                return;
            }

            setMessages((prev) => {
                if (prev.some((msg) => msg.id === message.id)) {
                    return prev;
                }

                return [...prev, message];
            });
        });

        return cleanup;
    }, [client, activeChat, loadChats]);

    const selectChat = useCallback(
        async (chat) => {
            setActiveChat(chat);
            setError("");

            client.joinChat(chat.chatId);

            try {
                const { data } = await api.get(
                    `/message/${chat.chatId}`
                );

                setMessages(data.message || []);
            } catch (err) {
                setError(
                    err.response?.data?.error ||
                    "Unable to load messages."
                );
            }
        },
        [api, client]
    );

    const createChat = useCallback(
        async (userId) => {
            const trimmedUserId = userId.trim();

            if (!trimmedUserId) return;

            setError("");

            try {
                await api.post("/chat", {
                    userId: trimmedUserId,
                });

                await loadChats();
            } catch (err) {
                setError(
                    err.response?.data?.error ||
                    "Unable to create chat."
                );
            }
        },
        [api, loadChats]
    );

    const sendMessage = useCallback(
        async (content) => {
            const trimmedContent = content.trim();

            if (!activeChat || !trimmedContent) {
                return;
            }

            setError("");

            try {
                await api.post("/message", {
                    chatId: activeChat.chatId,
                    content: trimmedContent,
                });

            } catch (err) {
                setError(
                    err.response?.data?.error ||
                    "Unable to send message."
                );
            }
        },
        [activeChat, api]
    );

    return (
        <ChatContext.Provider
            value={{
                user,
                chats,
                activeChat,
                messages,
                loading,
                error,
                createChat,
                selectChat,
                sendMessage,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};