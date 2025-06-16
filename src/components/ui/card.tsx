import * as React from "react";

export function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="border rounded shadow-sm p-4 bg-white">{children}</div>
    );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={className}>{children}</div>;
}
