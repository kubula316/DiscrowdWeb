import React from "react";

const roleOrder = {
    OWNER: 1,
    ADMIN: 2,
    MEMBER: 3,
};

export default function RightSidebar({ activeServerData, userStatuses }) {
    const memberships = activeServerData?.memberships || [];

    const filteredMemberships = memberships.filter(member => member.role !== "LEFT");

    const sortedMemberships = [...filteredMemberships].sort(
        (a, b) => (roleOrder[a.role] || 5) - (roleOrder[b.role] || 5)
    );

    const groupedMemberships = {};
    sortedMemberships.forEach((member) => {
        const role = member.role;
        if (!groupedMemberships[role]) {
            groupedMemberships[role] = [];
        }
        groupedMemberships[role].push(member);
    });

    return (
        <div className="w-60 bg-[#2b2d31] text-gray-200 text-sm border-l border-[#1e1f22] flex flex-col">
            {Object.entries(groupedMemberships).map(([role, members]) => (
                <div key={role}>
                    <div className="px-3 py-2 text-xs text-gray-400 font-semibold uppercase">{role}</div>
                    {members.map((member) => (
                        <UserEntry key={member.id} user={member} status={userStatuses && userStatuses[member.userId]?.status} />
                    ))}
                </div>
            ))}
        </div>
    );
}

function UserEntry({ user, status }) {
    const isOnline = status === "ONLINE";
    return (
        <div
            className={`px-3 py-1 flex items-center gap-2 rounded cursor-pointer ${
                isOnline ? "hover:bg-[#3a3c42]" : "opacity-50"
            }`}
        >
            <div className="relative">
                <img
                    src={user.avatarUrl || "https://via.placeholder.com/32"}
                    alt={user.nickname}
                    className="w-8 h-8 rounded-full object-cover"
                />
                {isOnline && (
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-gray-800"></div>
                )}
            </div>
            <span className="truncate">{user.nickname}</span>
        </div>
    );
}