const IconButton = ({ children, ...props }) => (
    <button className="p-3 bg-gray-700 text-white rounded-full disabled:opacity-50 text-2xl flex items-center justify-center"{...props}>
        {children}
    </button>
);

export default IconButton;