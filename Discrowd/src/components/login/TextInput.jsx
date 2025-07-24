// Discrowd/src/components/common/TextInput.jsx
import React from "react";

export default function TextInput({ id, label, type = "text", value, onChange, placeholder, required }) {
    return (
        <div>
            <label className="block mb-1" htmlFor={id}>{label}</label>
            <input
                id={id}
                type={type}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
}