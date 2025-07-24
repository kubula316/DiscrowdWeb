import React from "react";

const roleOrder = {
    OWNER: 1,
    ADMIN: 2,
    MEMBER: 3,
};

export default function RightSidebar({ activeServerData }) {
    const memberships = activeServerData?.memberships || [];

    // Filtrowanie użytkowników z rolą "LEFT"
    const filteredMemberships = memberships.filter(member => member.role !== "LEFT");

    // Sortowanie użytkowników po roli
    const sortedMemberships = [...filteredMemberships].sort(
        (a, b) => (roleOrder[a.role] || 5) - (roleOrder[b.role] || 5)
    );

    // Grupowanie użytkowników po roli
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
                        <UserEntry key={member.id} user={member} />
                    ))}
                </div>
            ))}
        </div>
    );
}

function UserEntry({ user }) {
    return (
        <div className="px-3 py-1 flex items-center gap-2 hover:bg-[#3a3c42] rounded cursor-pointer">
            <div className="relative">
                <img
                    src={user.avatarUrl || "https://via.placeholder.com/32"}
                    alt={user.nickname}
                    className="w-8 h-8 rounded-full object-cover"
                />
            </div>
            <span className="truncate">{user.nickname}</span>
        </div>
    );
}