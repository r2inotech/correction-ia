import * as React from "react";

export function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
            {...props}
        >
            {children}
        </button>
    );
}
