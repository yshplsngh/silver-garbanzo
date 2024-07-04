import LoadingSpinner from "./LoadingSpinner.tsx";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string,
    variant: "primary" | "secondary",
    loading?: boolean,
}

export default function Button({className, text, variant = "primary", loading, ...props}: ButtonProps) {
    return (
        //Todo: add type submit in button
        <button
            type={"button"}
            disabled={loading || props.disabled}
            className={`group flex h-10 w-full items-center justify-center space-x-2 rounded-md border px-4 text-lg transition-all 
                ${variant == "primary" ? `border-black bg-black ${!loading && "text-white hover:bg-white hover:text-black"}` : ""}
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