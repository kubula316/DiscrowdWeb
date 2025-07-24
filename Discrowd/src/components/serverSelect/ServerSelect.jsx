// ServerSelect.jsx
import { useState, useEffect } from "react";
import IconButton from "./IconButton.jsx";
import SimpleButton from "./SimpleButton.jsx";
import ServerList from "./ServerList.jsx";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import CreateServerModal from "../Modals/CreateServerModal.jsx";


const PAGE_SIZE = 5;

const ServerSelect = ({ onAddServer, onSelectServer }) => {
    const navigate = useNavigate();
    const [servers, setServers] = useState([]);
    const [page, setPage] = useState(0);
    const [selectedIdx, setSelectedIdx] = useState(null);
    const [isCreateServerModalOpen, setIsCreateServerModalOpen] = useState(false); // State dla modala

    useEffect(() => {
        const token = Cookies.get("token");

        fetch("http://localhost:9000/server-service/server/me", {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
            .then((res) => res.json())
            .then((data) => setServers(data))
            .catch(() => setServers([]));
    }, []);

    function onConnect(server) {
        if (server && server.id !== "add") {
            navigate(`/server/${server.id}`);
        }
    }

    const items = [...servers, { id: "add", name: "Dodaj", iconUrl: "+" }];

    const startIdx = page * PAGE_SIZE;
    const endIdx = startIdx + PAGE_SIZE;
    const visibleItems = items.slice(startIdx, endIdx);

    const handleClick = (server, idx) => {
        const globalIdx = startIdx + idx;
        if (selectedIdx === globalIdx && server.id !== "add") {
            setSelectedIdx(null);
        } else {
            setSelectedIdx(globalIdx);
        }
        if (server.id === "add") {
            // onAddServer && onAddServer(); // Usuń to
            setIsCreateServerModalOpen(true); // Otwórz modal zamiast tego
        } else {
            onSelectServer && onSelectServer(server);
        }
    };

    const handleCreateServer = (newServerData) => {
        const token = Cookies.get("token");
        fetch("http://localhost:9000/server-service/server/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(newServerData),
        })
            .then((res) => res.json())
            .then((newServer) => {
                navigate(`/server/${newServer.serverId}`);
            })
            .catch((error) => {
                console.error("Error creating server:", error);
            });
    };

    const handleJoinServer = (serverId) => {
        const token = Cookies.get("token");
        console.log(serverId)
        fetch(`http://localhost:9000/server-service/server/join?serverId=${serverId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        })
            .then((res) => res.json())
            .then((joinedServer) => {
                navigate(`/server/${joinedServer.id}`);
            })
            .catch((error) => {
                console.error("Error joining server:", error);
            });
    };



    const selectedServer = items[selectedIdx];
    const isServerSelected = selectedServer && selectedServer.id !== "add";

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-transparent">
            <div className="flex items-center gap-8 mb-6">
                <IconButton onClick={() => setPage(page - 1)} disabled={page === 0} aria-label="Poprzednie">
                    ⬅️
                </IconButton>
                <ServerList
                    visibleItems={visibleItems}
                    selectedIdx={selectedIdx}
                    startIdx={startIdx}
                    onServerClick={handleClick}
                />
                <IconButton onClick={() => setPage(page + 1)} disabled={endIdx >= items.length}>
                    ➡️
                </IconButton>
            </div>

            <div className="min-h-[60px] flex items-center justify-center w-full">
                {isServerSelected && (
                    <SimpleButton onClick={() => onConnect && onConnect(selectedServer)}>Connect</SimpleButton>
                )}
            </div>

            <CreateServerModal
                open={isCreateServerModalOpen}
                onClose={() => setIsCreateServerModalOpen(false)}
                onCreate={handleCreateServer}
                onJoin={handleJoinServer}
            />
        </div>
    );
};

export default ServerSelect;