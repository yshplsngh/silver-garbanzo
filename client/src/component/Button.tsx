import LoadingSpinner from "./LoadingSpinner.tsx";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string,
    variant: "primary" | "secondary",
    type:"button" | "submit"
    loading?: boolean,
}

export default function Button({className, text, type="button", variant = "primary", loading, ...props}: ButtonProps) {
    return (
        //Todo: add type submit in button
        <button
            type={type}
            onClick={props.onClick}
            disabled={loading || props.disabled}
            className={`group h-9 flex w-fit items-center justify-center space-x-2 rounded-full border px-7 text-md transition-all 
                ${variant == "primary" ? `border-black bg-gray-900 text-white ${!loading && "hover:bg-black"}` : ""}
                ${variant == "secondary" ? "border-gray-200 bg-white text-gray-600 hover:bg-gray-100" : ""}
                ${props.disabled || loading ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400" : ""}
                ${className}
            `}
        >
            {loading ? <LoadingSpinner/> : null}
            {text && <p>{text}</p>}
        </button>
    )
}