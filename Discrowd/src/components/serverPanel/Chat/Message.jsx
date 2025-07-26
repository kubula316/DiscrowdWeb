import React from "react";

export default function Message({ avatar, username, time, content, imageUrl }) {
    return (
        <div className="flex items-start gap-3">
            <img
                src={avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full"
            />
            <div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-white">{username}</span>
                    <span className="text-gray-400 text-xs">{time}</span>
                </div>
                <p className="text-sm text-gray-200">
                    {content}
                </p>
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Message Image"
                        className="mt-2 rounded-md max-w-xs"
                    />
                )}
            </div>
        </div>
    );
}