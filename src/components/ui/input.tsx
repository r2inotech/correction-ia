import * as React from "react";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className="p-2 border border-gray-300 rounded w-full"
            {...props}
        />
    );
}
