import React, {useEffect, useRef, useState, useCallback} from "react";
import { Hash, Bell, Pin, Users, Inbox, HelpCircle, Plus, Smile } from "lucide-react";
import Message from "./Message.jsx";
import Cookies from "js-cookie";
import {toast} from "react-hot-toast";

export default function Chat({ activeChannel, messages, activeChannelName, id, stompClient, memberships, onMessagesUpdate }) {
    const messagesEndRef = useRef(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const observerRef = useRef(null);
    const firstMessageRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const isToday = (timestamp) => {
        const messageDate = new Date(timestamp).toLocaleDateString();
        const todayDate = new Date().toLocaleDateString();
        return messageDate === todayDate;
    };

    const loadOlderMessages = useCallback(async () => {
        if (!hasMoreMessages || loading || !activeChannel || messages.length === 0) return;

        setLoading(true);
        try {
            // Najstarsza wiadomość będzie pierwszą w tablicy
            const oldestMessage = messages[0];

            console.log(activeChannel, new Date(oldestMessage.timestamp).toISOString())

            const token = Cookies.get("token");
            const response = await fetch(
                `http://localhost:9000/server-service/messages/load/before?channelId=${activeChannel}&timestamp=${oldestMessage.timestamp}&limit=30`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const olderMessages = await response.json();

            console.log(olderMessages)

            if (olderMessages.length === 0) {
                setHasMoreMessages(false);
            } else {
                if (olderMessages.length < 30) {
                    setHasMoreMessages(false);
                }
                // Zachowaj pozycję przewijania
                const scrollElement = messagesEndRef.current;
                const scrollPosition = scrollElement.scrollHeight - scrollElement.scrollTop;

                // Dodaj starsze wiadomości na początek listy
                const updatedMessages = [...olderMessages, ...messages];

                // Zaktualizuj propsy przez wywoływanie zdarzenia
                if (typeof onMessagesUpdate === 'function') {
                    onMessagesUpdate(updatedMessages);
                }

                // Przywróć pozycję przewijania
                setTimeout(() => {
                    if (scrollElement) {
                        scrollElement.scrollTop = scrollElement.scrollHeight - scrollPosition;
                    }
                }, 10);
            }
        } catch (error) {
            console.error("Błąd podczas ładowania starszych wiadomości:", error);
        } finally {
            setLoading(false);
        }
    }, [activeChannel, messages, hasMoreMessages, loading]);

    // Inicjalizacja obserwatora po załadowaniu komponentu
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading && hasMoreMessages) {
                    loadOlderMessages();
                }
            },
            { threshold: 0.1 }
        );

        observerRef.current = observer;

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loadOlderMessages, loading, hasMoreMessages]);

    // Obserwuj pierwszą wiadomość
    useEffect(() => {
        if (firstMessageRef.current && observerRef.current) {
            observerRef.current.observe(firstMessageRef.current);
            return () => {
                if (firstMessageRef.current) {
                    observerRef.current.unobserve(firstMessageRef.current);
                }
            };
        }
    }, [messages]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }

        if (activeChannel) {
            setHasMoreMessages(true);
        }
    }, [messages, activeChannel]);

    const uploadImage = async (imageFile) => {
        const formData = new FormData();
        formData.append("file", imageFile);

        try {
            const token = Cookies.get("token");
            const response = await fetch("http://localhost:9000/upload-service/upload/message-image", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const imageUrl = await response.text(); // Pobierz odpowiedź jako tekst
            return imageUrl;
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image.");
            return null;
        }
    };

    const sendMessage = async () => {
        let imageUrl = null;
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
            if (!imageUrl) {
                return; // If upload fails, don't send the message
            }
        }

        if (stompClient && (input.trim() || imageUrl)) {
            const message = {
                content: input.trim(),
                channelId: activeChannel,
                imageUrl: imageUrl
            };

            stompClient.send(
                `/app/sendMessage/${id}`,
                {},
                JSON.stringify(message)
            );
            setInput("");
            setImagePreview(null);
            setImageFile(null);
        }
    };

    const handlePaste = useCallback(async (event) => {
        const items = (event.clipboardData || event.clipboardData).items;
        let blob = null;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") === 0) {
                blob = items[i].getAsFile();
                break;
            }
        }

        if (blob) {
            event.preventDefault();
            const imageUrl = URL.createObjectURL(blob);
            setImagePreview(imageUrl);
            setImageFile(blob);
        }
    }, []);

    const handleDrop = useCallback(async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
            setImageFile(file);
        }
    }, []);

    const preventDefault = (event) => {
        event.preventDefault();
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-[#313338] text-white overflow-hidden"
             onPaste={handlePaste}
             onDrop={handleDrop}
             onDragOver={preventDefault}
        >
            {/* Górny pasek */}
            <div className="h-12 border-b border-[#2b2d31] px-4 flex items-center justify-between bg-[#313338]">
                <div className="flex items-center gap-2 text-white text-sm font-semibold">
                    <Hash size={20} />
                    <span>{activeChannelName ? `${activeChannelName}` : ""}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                    <Bell size={18} className="hover:text-white cursor-pointer" />
                    <Pin size={18} className="hover:text-white cursor-pointer" />
                    <Users size={18} className="hover:text-white cursor-pointer" />
                    <Inbox size={18} className="hover:text-white cursor-pointer" />
                    <HelpCircle size={18} className="hover:text-white cursor-pointer" />
                </div>
            </div>

            {/* Sekcja wiadomości */}
            <div ref={messagesEndRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
                {loading && <div className="text-center py-2 text-gray-400">Ładowanie starszych wiadomości...</div>}
                {!hasMoreMessages && messages.length > 0 && (
                    <div className="text-center py-2 text-gray-400">Nie ma więcej wiadomości</div>
                )}
                {messages.map((msg, index) => (
                    <div key={msg.id} ref={index === 0 ? firstMessageRef : null}>
                        <Message
                            key={msg.id}
                            avatar={memberships.find(user => user.userId === msg.senderId)?.avatarUrl || "Unknown User"}
                            username={memberships.find(user => user.userId === msg.senderId)?.nickname || "Unknown User"}
                            time={
                                isToday(msg.timestamp) ?
                                    new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) :
                                    new Date(msg.timestamp).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                            }
                            content={msg.content}
                            imageUrl={msg.imageUrl}
                        />
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="h-14 px-4 flex items-center gap-3 border-t border-[#2b2d31] bg-[#383a40]">
                <Plus size={20} className="text-gray-400 cursor-pointer hover:text-white" />
                <input
                    type="text"
                    placeholder={activeChannelName ? `Napisz na #${activeChannelName}` : "Wybierz kanał"}
                    className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-sm"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                />
                {imagePreview && (
                    <div className="w-10 h-10">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}
                <Smile size={20} className="text-gray-400 cursor-pointer hover:text-white" />
            </div>
        </div>
    );
}