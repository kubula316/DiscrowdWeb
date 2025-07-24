import { useState, useEffect } from "react";
import Modal from "./Modal.jsx";
import { X } from "lucide-react";

export default function CreateServerModal({ open, onClose, onCreate, onJoin }) {
    const [name, setName] = useState("");
    const [serverId, setServerId] = useState("");
    const [isCreating, setIsCreating] = useState(true);

    useEffect(() => {
        if (!open) {
            setName("");
            setServerId("");
            setIsCreating(true);
        }
    }, [open]);

    const handleCreate = () => {
        if (name.trim() && isCreating) {
            onCreate({ name });
        }
    };

    const handleJoin = () => {
        if (serverId.trim() && !isCreating) {
            onJoin(serverId);
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="p-6 w-80 bg-[#232428] relative">
            {/* X w prawym górnym rogu */}
            <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
                onClick={onClose}
                aria-label="Close"
                type="button"
            >
                <X size={20} />
            </button>
            <div className="flex flex-col gap-4">
                <div className="text-lg font-semibold text-white">{isCreating ? "Create Server" : "Join Server"}</div>

                <div className="flex items-center gap-2 justify-center">
                    <button
                        className={`px-4 py-2 rounded text-xs font-semibold ${isCreating ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"}`}
                        onClick={() => setIsCreating(true)}
                    >
                        Create Server
                    </button>
                    <button
                        className={`px-4 py-2 rounded text-xs font-semibold ${!isCreating ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"}`}
                        onClick={() => setIsCreating(false)}
                    >
                        Join Server
                    </button>
                </div>

                {isCreating ? (
                    <div>
                        <label className="block text-xs text-gray-300 mb-1">Server Name</label>
                        <input
                            className="w-full p-2 rounded bg-[#2b2d31] text-white"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="np. Super Server"
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block text-xs text-gray-300 mb-1">Server ID</label>
                        <input
                            className="w-full p-2 rounded bg-[#2b2d31] text-white"
                            value={serverId}
                            onChange={(e) => setServerId(e.target.value)}
                            placeholder="Enter Server ID"
                        />
                    </div>
                )}

                {isCreating ? (
                    <button
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
                        onClick={handleCreate}
                        disabled={!name.trim()}
                    >
                        Create Server
                    </button>
                ) : (
                    <button
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 disabled:opacity-50"
                        onClick={handleJoin}
                        disabled={!serverId.trim()}
                    >
                        Join Server
                    </button>
                )}
            </div>
        </Modal>
    );
}