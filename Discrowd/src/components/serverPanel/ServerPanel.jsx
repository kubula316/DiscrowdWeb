import ServerSidebar from "./serverSidebar/ServerSidebar.jsx";
import ChannelSidebar from "./ChanelSidebar/ChanelSidebar.jsx";
import TopBar from "./TopBar.jsx";
import Chat from "./Chat/Chat.jsx";
import RightSidebar from "./rightSidebar/RightSidebar.jsx";
import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function ServerPanel() {

    // State to manage the connection status of the WebSocket case of strict mode
    const hasConnected = useRef(false);
    // State to manage the active server and the list of servers
    const { id } = useParams();
    const [userData, setUserData] = useState(null)
    //console.log("USER" + userId);
    const [activeServer, setActiveServer] = useState(null);
    const [servers, setServers] = useState([]);
    // State to manage the Messages of channels
    const [activeChannel, setActiveChannel] = useState(null);
    const [messagesCache, setMessagesCache] = useState({});
    //State to manage connected server
    const [activeServerData, setActiveServerData] = useState(null);
    // State to manage the STOMP client
    const [stompClient, setStompClient] = useState(null);
    //State to manage user statuses
    const [userStatuses, setUserStatuses] = useState(null)

    function handleMessageUpdate(updatedMessages) {
        setMessagesCache(prev => ({
            ...prev,
            [activeChannel]: updatedMessages
        }));
    }
    useEffect(() => {

        const token = Cookies.get("token");

        fetch(`http://localhost:9000/auth-service/user/data?id=${Cookies.get("userId")}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(data => {
                setUserData(data);
            })
            .catch(() => setUserData(null));
    }, [id]);
    // userServes data
    useEffect(() => {

        const token = Cookies.get("token");

        fetch("http://localhost:9000/server-service/server/me", {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(data => {
                //console.log("Pobrane serwery:", data);
                setServers(data);
                setActiveServer(id)
            })
            .catch(() => setServers([]));
    }, [id]);
    // Fetch server details when activeServer changes
    useEffect(() => {
        const token = Cookies.get("token");
        if (activeServer) {
            fetch(`http://localhost:9000/server-service/server/details?serverId=${activeServer}`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(res => res.json())
                .then(data => {
                    //console.log("Szczegóły serwera:", data);
                    setActiveServerData(data)
                    setActiveChannel(data.categories[0]?.textChannels[0]?.id || "awanturki");
                })
                .catch(() => setActiveServerData(null));
        }
    }, [activeServer]);
    // Fetch messages for the active channel when it changes
    useEffect(() => {
        const token = Cookies.get("token");
        if (!activeChannel || messagesCache[activeChannel]) return;
        fetch(`http://localhost:9000/server-service/messages/load/latest?channelId=${activeChannel}&limit=20`,{
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => res.json())
            .then(data => {
                setMessagesCache(prev => ({ ...prev, [activeChannel]: data }));
                //console.log("Pobrane wiadomości:", data);
            });
    }, [activeChannel, messagesCache]);
    //Connect to WebSocket server
    useEffect(() => {
        const connectWebSocket = () => {
            if (hasConnected.current) return;

            hasConnected.current = true;
            ///SockJS
            const sock = new SockJS(`http://localhost:8081/ws/server`);
            //const sock = new SockJS(`http://localhost:9000/server-service/ws/server`);
            const client = Stomp.over(sock);
            const token = Cookies.get("token");

            client.connect({'Authorization': 'Bearer ' + token}, () => {
                setStompClient(client);

                client.subscribe(`/topic/messages/${id}`, (message) => {
                    console.log("Dodano wiadomość:", message);
                    const newMessage = JSON.parse(message.body);
                    setMessagesCache((prev) => {
                        if (!prev[newMessage.channelId]) {
                            // Jeśli kanał nie istnieje w cache, zignoruj wiadomość
                            return prev;
                        }
                        const existingMessages = prev[newMessage.channelId] || [];
                        return {
                            ...prev,
                            [newMessage.channelId]: [...existingMessages, newMessage],
                        };
                    });
                })

                client.subscribe(`/topic/server/${id}`, (server) => {
                    console.log("Zaktualizowano server:", server);
                    const newServerData = JSON.parse(server.body);
                    setActiveServerData(newServerData);
                })

                client.subscribe(
                    `/user/queue/initial.server.${id}.statuses`,
                    (message) => {
                        const initialServerStatuses = JSON.parse(message.body);
                        console.log("Otrzymano początkowe statusy dla serwera:", initialServerStatuses);
                        setUserStatuses(initialServerStatuses);
                    },
                    { id: `initial-server-statuses-sub-${id}` } // Unique ID for subscription
                );

                client.subscribe(
                    `/topic/server/${id}/status.updates`,
                    (message) => {
                        const updatedStatus = JSON.parse(message.body);
                        console.log("Otrzymano aktualizację statusu serwera:", updatedStatus);

                        setUserStatuses((prevStatuses) => {
                            const newStatuses = { ...prevStatuses };
                            // Remove if status is OFFLINE OR if the user's serverId is no longer this server
                            if (updatedStatus.status === 'OFFLINE' || updatedStatus.serverId !== id) {
                                delete newStatuses[updatedStatus.userId];
                            } else {
                                // Otherwise, update or add the user's status
                                newStatuses[updatedStatus.userId] = updatedStatus;
                            }
                            return newStatuses;
                        });
                    },
                    { id: `server-status-updates-sub-${id}` } // Unique ID for subscription
                );
                client.send(`/app/server/join`, {}, id);
                console.log(`Sent /app/server/join message for serverId: ${id}.`);


                toast.success("Połaćczono z serwerem!");
            });
        };

        connectWebSocket();
        //stomp client
    }, [id]);

    const activeChannelObj = activeServerData?.categories
        ?.flatMap(cat => cat.textChannels)
        ?.find(ch => ch.id === activeChannel);

    const activeChannelName = activeChannelObj?.name || "";

    return (

        <div className="flex flex-col h-screen min-h-0">
            <div className="flex flex-1 min-h-0">
                <ServerSidebar activeServer={activeServer} setActiveServer={setActiveServer} servers={servers} hasConnected={{hasConnected}}/>
                <ChannelSidebar userData={userData} activeServerData={activeServerData} activeChannel={activeChannel} setActiveChannel={setActiveChannel} stompClient={stompClient} id={id}/>
                {activeServerData && <Chat onMessagesUpdate={handleMessageUpdate} memberships={activeServerData.memberships}  id={id} stompClient={stompClient} activeChannelName={activeChannelName} activeChannel={activeChannel} messages={messagesCache[activeChannel] || []}/>}
                <RightSidebar activeServerData={activeServerData} userStatuses={userStatuses}/>
            </div>
        </div>
    );
}
