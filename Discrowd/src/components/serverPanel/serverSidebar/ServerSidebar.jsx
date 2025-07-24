import React, { useState } from "react";
import { Plus } from "lucide-react";
import {useNavigate} from "react-router";



export default function ServerSidebar({activeServer, setActiveServer, servers = servers, hasConnected}) {
    const navigate = useNavigate();

    function changeServer(server) {
        //TODO: załadować socket ponownie
        navigate(`/server/${server.id}`);
    }

    return (
        <div className="w-16 h-screen bg-[#1e1f22] flex flex-col items-center py-4 space-y-3">
            {servers.map((server) => {
                const isActive = activeServer === server.id;

                return (
                    <div
                        key={server.id}
                        onClick={() => changeServer(server)}
                        className="group relative cursor-pointer"
                    >
                        {/* Lewy pasek aktywnego serwera */}
                        <div
                            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r-full bg-white transition-opacity ${
                                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                            }`}
                        />

                        {/* Obrazek serwera */}
                        <img
                            src={server.iconUrl}
                            alt={server.name}
                            className={`w-12 h-12 rounded-full object-cover transition-all
                ${isActive ? "rounded-2xl ring-2 ring-white" : "hover:rounded-2xl"}
              `}
                        />

                        {/* Tooltip */}
                        <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {server.name}
                        </div>
                    </div>
                );
            })}

            {/* Ikonka "+" */}
            <div
                className="w-12 h-12 bg-[#313338] hover:bg-green-500 text-white flex items-center justify-center rounded-full cursor-pointer transition-all hover:rounded-2xl"
                title="Dodaj serwer"
                onClick={() => alert("Dodaj nowy serwer")}
            >
                <Plus size={20} />
            </div>
        </div>
    );
}
