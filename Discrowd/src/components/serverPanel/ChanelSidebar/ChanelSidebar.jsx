import VoiceChannel from "./VoiceChannel.jsx";
import ChannelCategory from "./ChannelCategory.jsx";
import TextChannel from "./TextChannel.jsx";
import ServerHeader from "./ServerHeader.jsx";
import {useState} from "react";
import UserPanel from "./UserPanel.jsx";

export default function ChannelSidebar({activeServerData, activeChannel, setActiveChannel, stompClient, id, userData}) {

    if (!activeServerData || !activeServerData.categories) {
        return (
            <div className="w-60 h-screen bg-[#2b2d31] text-white flex flex-col">
                <ServerHeader server={activeServerData} />
                <div className="p-4 text-gray-400">Łoading...</div>
            </div>
        );
    }
    console.log(activeServerData.categories);
    return (
        <div className="w-60 h-screen bg-[#2b2d31] text-white flex flex-col">
            <ServerHeader server={activeServerData} />
            <div className="flex-1 overflow-y-auto p-4">
                {activeServerData.categories.map((category) => (
                    <ChannelCategory
                        key={category.id}
                        category={category}
                        activeServerId={activeServerData.id}
                        stompClient={stompClient}
                        id={id}
                    >
                        {category.textChannels.map((channel) => (
                            <TextChannel
                                key={channel.id}
                                channel={channel}
                                isActive={activeChannel === channel.id}
                                onClick={() => setActiveChannel(channel.id)}
                            />
                        ))}

                        {category.voiceChannels.map((channel) => (
                            <VoiceChannel
                                key={channel.id}
                                channel={channel}
                                isActive={activeChannel === `voice-${channel.id}`}
                                onClick={() => setActiveChannel()}
                            />
                        ))}
                    </ChannelCategory>
                ))}
            </div>

            {userData && <UserPanel user={userData} status={"ONLINE"} />}
        </div>
    );
}