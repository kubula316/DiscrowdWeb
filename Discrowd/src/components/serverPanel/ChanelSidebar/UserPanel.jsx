// UserPanel.jsx
import React from 'react';

function UserPanel({ user, status }) {
    const isOnline = status === "ONLINE";
    console.log("USER:" + user);
    return (
        <div className="flex items-center justify-between p-3 bg-[#202225] rounded-b">
            <div className="flex items-center gap-2">
                <div className="relative">
                    <img
                        src={user.profileImageUrl || "https://static.wikia.nocookie.net/naruto/images/4/4c/Fourth_Raikage_2.png/revision/latest?cb=20180901014100"}
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    {isOnline && (
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-gray-800"></div>
                    )}
                </div>
                <div className="text-sm">{user.username}</div>
            </div>
            {/* Możesz dodać dodatkowe ikony lub opcje tutaj */}
        </div>
    );
}

export default UserPanel;