import { ChevronDown } from "lucide-react";

export default function ServerHeader({ server }) {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1f22] bg-[#2b2d31]">
            <div className="flex items-center gap-2 font-semibold text-sm">
                {server?.name || "Loading..."}
            </div>
            <ChevronDown size={18} className="text-gray-400 cursor-pointer" />
        </div>
    );
}