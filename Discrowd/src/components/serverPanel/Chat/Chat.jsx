import React, {useEffect, useRef, useState} from "react";
import { Hash, Bell, Pin, Users, Inbox, HelpCircle, Plus, Smile } from "lucide-react";
import Message from "./Message.jsx";

export default function Chat({ activeChannel, messages, activeChannelName, id, stompClient, memberships }) {
    const messagesEndRef = useRef(null);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages, activeChannel]);

    const sendMessage = async () => {
        if (stompClient && input.trim()) {

            const message = {
                content: input,
                channelId: activeChannel,
            };

            stompClient.send(
                `/app/sendMessage/${id}`,
                {},
                JSON.stringify(message)
            );
            setInput("");
        }

        //
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-[#313338] text-white overflow-hidden">
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
                {messages.map(msg => (
                    <Message
                        key={msg.id}
                        //avatar={`https://api.dicebear.com/7.x/thumbs/svg?seed="${msg.Id}"`}
                        avatar={memberships.find(user => user.userId === msg.senderId)?.avatarUrl || "Unknown User"}
                        username={memberships.find(user => user.userId === msg.senderId)?.nickname || "Unknown User"}
                        time={new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        content={msg.content}
                    />
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
                <Smile size={20} className="text-gray-400 cursor-pointer hover:text-white" />
            </div>
        </div>
    );
}