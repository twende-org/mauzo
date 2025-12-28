import React from "react";

interface InputFieldProps {
    label?: string;
    name: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    error?: string; // optional error message
    disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    className,
    error,
    disabled,
}) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label htmlFor={name} className="font-medium text-gray-700">
                    {label}
                </label>
            )}

            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 
                placeholder-gray-400 shadow-sm focus:outline-none 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                ${className ? className : ""} 
                ${error ? "border-red-500 focus:ring-red-500" : ""}
            `}

            />

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default InputField;
