import { Mic } from "lucide-react";

export default function VoiceChannel({ channel, isActive, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-2 text-sm px-2 py-1 rounded cursor-pointer transition
                ${isActive ? "bg-[#404249] text-white font-medium" : "text-gray-300 hover:bg-[#3a3c40]"}
            `}
        >
            <Mic size={16} />
            <span>{channel.name}</span>
        </div>
    );
}