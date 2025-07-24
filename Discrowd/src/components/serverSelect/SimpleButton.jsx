const SimpleButton = ({ children, className = "", ...props }) => (
    <button
        className={`px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow ${className}`}
        {...props}
    >
        {children}
    </button>
);

export default SimpleButton;