const ServerList = ({ visibleItems, selectedIdx, startIdx, onServerClick }) => (
    <div className="flex items-center gap-8">
        {visibleItems.map((server, idx) => {
            const isSelected = selectedIdx === startIdx + idx && server.id !== "add";
            return (
                <button
                    key={server.id}
                    onClick={() => onServerClick(server, idx)}
                    className="flex flex-col items-center justify-center min-w-[14rem] focus:outline-none"
                >
                    <div
                        className={`w-56 h-56 rounded-2xl flex items-center justify-center text-8xl mb-2 shadow-lg transition
                            ${server.id === "add"
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : isSelected
                                ? "bg-blue-700 text-white scale-110"
                                : "bg-gray-800 hover:bg-gray-700 text-white"
                        }`}
                        style={{
                            transition: "transform 0.2s, background 0.2s"
                        }}
                    >
                        {server.id === "add" ? (
                            <span className="text-6xl">+</span>
                        ) : (
                            <img
                                src={server.iconUrl}
                                alt={server.name}
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        )}
                    </div>
                    {server.name && (
                        <span
                            className={`font-bold text-xl text-center w-56 truncate
                                ${server.id === "add" ? "text-red-600" : "text-white"}`}
                        >
                            {server.name}
                        </span>
                    )}
                </button>
            );
        })}
    </div>
);

export default ServerList;