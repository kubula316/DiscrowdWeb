import React from "react";

export default function TopBar() {
    return (
        <div className="h-10 bg-[#1e1f22] border-b border-[#111214] flex items-center justify-center relative z-10">
            <div className="flex items-center gap-2 text-white font-medium text-sm">
                <img
                    src="https://via.placeholder.com/24x24?text=S"
                    alt="Server Icon"
                    className="w-5 h-5 rounded-full"
                />
                <span className="truncate">Tak O</span>
            </div>
        </div>
    );
}