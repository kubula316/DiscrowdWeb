import { ChevronDown, Plus } from "lucide-react";
import CreateChannelModal from "../../Modals/CreateChannelModal.jsx";
import {useState} from "react";

export default function ChannelCategory({ category, children, stompClient, id}) {
    const [showModal, setShowModal] = useState(false);


    const handleCreate = async ({ type, name }) => {
        if (stompClient){
            const url =
                type === "text"
                    ? `/app/addTextChannel/${id}`
                    : `/app/addVoiceChannel/${id}`

            const request = {
                serverId: id,
                channelName: name,
                categoryId: category.id
            };
            console.log(request);

            stompClient.send(
                url,
                {"X-User-Id": "20003"},
                JSON.stringify(request)
            );
        }

        setShowModal(false);

    };

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between text-gray-400 text-xs uppercase font-bold mb-2">
                <div className="flex items-center gap-1">
                    <ChevronDown size={14} />
                    {category.name}
                </div>
                <Plus size={16} className="cursor-pointer hover:text-white" onClick={() => setShowModal(true)}/>
            </div>
            {children}
            <CreateChannelModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onCreate={handleCreate}
            />
        </div>
    );
}