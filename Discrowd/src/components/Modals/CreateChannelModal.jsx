import {useState, useEffect} from "react";
import Modal from "./Modal.jsx";
import { X } from "lucide-react";

export default function CreateChannelModal({open, onClose, onCreate}) {
    const [type, setType] = useState("text");
    const [name, setName] = useState("");

    useEffect(() => {
        if (!open) {
            setType("text");
            setName("");
        }
    }, [open]);

    const handleCreate = () => {
        if (name.trim()) {
            onCreate({type, name});
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="p-6 w-80 bg-[#232428] relative">
            {/* X w prawym górnym rogu */}
            <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
                onClick={onClose}
                aria-label="Zamknij"
                type="button"
            >
                <X size={20} />
            </button>
            <div className="flex flex-col gap-4">
                <div className="text-lg font-semibold text-white">Nowy kanał</div>
                <div>
                    <label className="block text-xs text-gray-300 mb-1">Typ kanału</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-1 text-white cursor-pointer">
                            <input
                                type="radio"
                                name="channelType"
                                value="text"
                                checked={type === "text"}
                                onChange={e => setType(e.target.value)}
                                className="accent-blue-600"
                            />
                            Tekstowy
                        </label>
                        <label className="flex items-center gap-1 text-white cursor-pointer">
                            <input
                                type="radio"
                                name="channelType"
                                value="voice"
                                checked={type === "voice"}
                                onChange={e => setType(e.target.value)}
                                className="accent-blue-600"
                            />
                            Głosowy
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-gray-300 mb-1">Nazwa kanału</label>
                    <input
                        className="w-full p-2 rounded bg-[#2b2d31] text-white"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="np. ogólny"
                    />
                </div>
                <button
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
                    onClick={handleCreate}
                    disabled={!name.trim()}
                >
                    Utwórz
                </button>
            </div>
        </Modal>
    );
}